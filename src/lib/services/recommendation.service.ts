import { prisma } from '@/lib/prisma'
import { DifficultyLevel, TeachingStyle } from '@prisma/client'

/**
 * Motor de Recomendación V1
 * Basado en travesía del grafo de conocimiento y scoring de metadata
 */

interface UserProfile {
  learningStyle?: TeachingStyle
  currentLevel: number
  completedOAs: string[]
  preferredSubjects: string[]
  avgCompletionRate: number
}

interface ScoredLearningObject {
  id: string
  title: string
  score: number
  reason: string
}

export class RecommendationService {
  /**
   * Obtener recomendaciones personalizadas para un usuario
   */
  static async getRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<ScoredLearningObject[]> {
    // 1. Obtener perfil del usuario
    const userProfile = await this.getUserProfile(userId)

    // 2. Obtener candidatos (OAs que el usuario NO ha completado)
    const candidates = await this.getCandidates(userId, userProfile)

    // 3. Scoring de cada candidato
    const scored = candidates.map((oa) => ({
      ...oa,
      score: this.calculateScore(oa, userProfile),
      reason: this.generateReason(oa, userProfile),
    }))

    // 4. Ordenar por score y retornar top N
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        title: item.title,
        score: item.score,
        reason: item.reason,
      }))
  }

  /**
   * Obtener el "siguiente paso" óptimo basándose en el grafo
   */
  static async getNextStep(userId: string, currentOAId?: string) {
    const userProfile = await this.getUserProfile(userId)

    if (!currentOAId) {
      // Si no hay OA actual, recomendar puntos de entrada
      return this.getEntryPoints(userProfile)
    }

    // Obtener OAs que tienen como prerrequisito el actual
    const nextSteps = await prisma.learningObject.findMany({
      where: {
        prerequisites: {
          some: {
            toId: currentOAId,
          },
        },
        published: true,
        id: {
          notIn: userProfile.completedOAs,
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            educatorProfile: {
              select: {
                avgRating: true,
                verified: true,
              },
            },
          },
        },
      },
      take: 5,
    })

    return nextSteps.map((oa) => ({
      id: oa.id,
      title: oa.title,
      score: this.calculateScore(oa as any, userProfile),
      reason: 'Siguiente paso natural en tu ruta de aprendizaje',
    }))
  }

  /**
   * Encontrar camino óptimo entre dos OAs
   */
  static async findOptimalPath(
    startOAId: string,
    targetOAId: string,
    userId: string
  ) {
    const userProfile = await this.getUserProfile(userId)

    // Implementación simplificada de BFS para encontrar camino
    const visited = new Set<string>()
    const queue: Array<{ id: string; path: string[] }> = [
      { id: startOAId, path: [startOAId] },
    ]

    while (queue.length > 0) {
      const { id, path } = queue.shift()!

      if (id === targetOAId) {
        // Encontramos el camino, ahora lo scoring
        const fullPath = await this.enrichPath(path)
        return fullPath
      }

      if (visited.has(id)) continue
      visited.add(id)

      // Obtener OAs conectados
      const connections = await prisma.knowledgeEdge.findMany({
        where: { fromId: id },
        select: { toId: true },
      })

      for (const conn of connections) {
        if (!visited.has(conn.toId)) {
          queue.push({
            id: conn.toId,
            path: [...path, conn.toId],
          })
        }
      }
    }

    return null // No se encontró camino
  }

  /**
   * Obtener perfil de aprendizaje del usuario
   */
  private static async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        level: true,
        learningStyle: true,
      },
    })

    const completedOAs = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
      },
      select: {
        learningObjectId: true,
      },
    })

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: {
        progressPercent: true,
        learningObject: {
          select: {
            subject: true,
          },
        },
      },
    })

    // Calcular tasa promedio de completitud
    const avgCompletionRate =
      enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + Number(e.progressPercent), 0) /
          enrollments.length
        : 0

    // Extraer materias preferidas
    const subjectCounts = enrollments.reduce((acc: any, e) => {
      const subject = e.learningObject?.subject
      if (subject) {
        acc[subject] = (acc[subject] || 0) + 1
      }
      return acc
    }, {})

    const preferredSubjects = Object.entries(subjectCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject)

    return {
      learningStyle: user?.learningStyle as TeachingStyle | undefined,
      currentLevel: user?.level || 1,
      completedOAs: completedOAs.map((p) => p.learningObjectId),
      preferredSubjects,
      avgCompletionRate,
    }
  }

  /**
   * Obtener candidatos para recomendación
   */
  private static async getCandidates(
    userId: string,
    userProfile: UserProfile
  ) {
    return prisma.learningObject.findMany({
      where: {
        published: true,
        id: {
          notIn: userProfile.completedOAs,
        },
        OR: [
          // Materias preferidas del usuario
          ...(userProfile.preferredSubjects.length > 0
            ? [{ subject: { in: userProfile.preferredSubjects } }]
            : []),
          // Nivel apropiado
          {
            difficultyLevel: {
              in: this.getSuitableDifficultyLevels(userProfile.currentLevel),
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            educatorProfile: {
              select: {
                avgRating: true,
                verified: true,
                tier: true,
              },
            },
          },
        },
        prerequisites: {
          select: {
            toId: true,
          },
        },
      },
      take: 50, // Limitar para performance
    })
  }

  /**
   * Calcular score de un OA para el usuario
   */
  private static calculateScore(oa: any, userProfile: UserProfile): number {
    let score = 0

    // Factor 1: Estilo de aprendizaje (30%)
    if (
      userProfile.learningStyle &&
      oa.teachingStyle?.includes(userProfile.learningStyle)
    ) {
      score += 30
    }

    // Factor 2: Calidad del contenido (25%)
    const creatorRating = oa.creator?.educatorProfile?.avgRating || 0
    score += (creatorRating / 5) * 25

    // Factor 3: Popularidad y engagement (20%)
    const popularityScore = Math.min((oa.views / 1000) * 10, 20)
    score += popularityScore

    // Factor 4: Verificación del educador (15%)
    if (oa.creator?.educatorProfile?.verified) {
      score += 15
    }

    // Factor 5: Nivel apropiado (10%)
    const difficultyMatch = this.getDifficultyMatch(
      oa.difficultyLevel,
      userProfile.currentLevel
    )
    score += difficultyMatch * 10

    return Math.min(score, 100)
  }

  /**
   * Generar razón human-readable de la recomendación
   */
  private static generateReason(oa: any, userProfile: UserProfile): string {
    const reasons = []

    if (
      userProfile.learningStyle &&
      oa.teachingStyle?.includes(userProfile.learningStyle)
    ) {
      reasons.push('Coincide con tu estilo de aprendizaje')
    }

    if (oa.creator?.educatorProfile?.verified) {
      reasons.push('Educador verificado')
    }

    if (oa.creator?.educatorProfile?.avgRating >= 4.5) {
      reasons.push('Altamente valorado')
    }

    if (userProfile.preferredSubjects.includes(oa.subject)) {
      reasons.push('Basado en tus intereses')
    }

    return reasons.length > 0 ? reasons.join(' · ') : 'Recomendado para ti'
  }

  /**
   * Obtener niveles de dificultad apropiados para el usuario
   */
  private static getSuitableDifficultyLevels(
    userLevel: number
  ): DifficultyLevel[] {
    if (userLevel <= 2) return ['BEGINNER', 'INTERMEDIATE']
    if (userLevel <= 5) return ['INTERMEDIATE', 'ADVANCED']
    if (userLevel <= 10) return ['ADVANCED', 'EXPERT']
    return ['EXPERT']
  }

  /**
   * Calcular qué tan bien el nivel de dificultad coincide con el usuario
   */
  private static getDifficultyMatch(
    difficulty: string,
    userLevel: number
  ): number {
    const map: Record<string, number[]> = {
      BEGINNER: [1, 2, 3],
      INTERMEDIATE: [3, 4, 5, 6],
      ADVANCED: [6, 7, 8, 9],
      EXPERT: [9, 10, 11, 12],
    }

    const range = map[difficulty] || []
    return range.includes(userLevel) ? 1 : 0.5
  }

  /**
   * Obtener puntos de entrada para nuevos usuarios
   */
  private static async getEntryPoints(userProfile: UserProfile) {
    const entryPoints = await prisma.learningObject.findMany({
      where: {
        difficultyLevel: 'BEGINNER',
        published: true,
        prerequisites: {
          none: {}, // No tienen prerrequisitos
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            educatorProfile: {
              select: {
                avgRating: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: [{ views: 'desc' }, { avgRating: 'desc' }],
      take: 10,
    })

    return entryPoints.map((oa) => ({
      id: oa.id,
      title: oa.title,
      score: this.calculateScore(oa, userProfile),
      reason: 'Punto de entrada perfecto para comenzar',
    }))
  }

  /**
   * Enriquecer un camino con información completa de cada OA
   */
  private static async enrichPath(oaIds: string[]) {
    const oas = await prisma.learningObject.findMany({
      where: {
        id: { in: oaIds },
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        difficultyLevel: true,
      },
    })

    // Ordenar según el camino
    return oaIds.map((id) => oas.find((oa) => oa.id === id)!)
  }
}
