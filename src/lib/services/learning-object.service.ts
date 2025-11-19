import { prisma } from '@/lib/prisma'
import {
  CreateLearningObjectInput,
  UpdateLearningObjectInput,
  SearchLearningObjectsInput,
  CreateKnowledgeEdgeInput,
} from '@/lib/validations/learning-object'
import { Prisma } from '@prisma/client'

/**
 * Servicio de Learning Objects
 * Capa de abstracción entre las APIs y la base de datos
 */
export class LearningObjectService {
  /**
   * Crear un nuevo Learning Object
   */
  static async create(data: CreateLearningObjectInput, creatorId: string) {
    return prisma.learningObject.create({
      data: {
        ...data,
        creatorId,
        publishedAt: data.published ? new Date() : null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            educatorProfile: {
              select: {
                verified: true,
                tier: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Actualizar un Learning Object
   */
  static async update(id: string, data: UpdateLearningObjectInput, userId: string) {
    // Verificar permisos
    const existing = await prisma.learningObject.findUnique({
      where: { id },
      select: { creatorId: true },
    })

    if (!existing) {
      throw new Error('Learning Object no encontrado')
    }

    if (existing.creatorId !== userId) {
      throw new Error('No tienes permisos para editar este contenido')
    }

    return prisma.learningObject.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.published ? new Date() : existing ? undefined : null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  }

  /**
   * Eliminar un Learning Object
   */
  static async delete(id: string, userId: string) {
    // Verificar permisos
    const existing = await prisma.learningObject.findUnique({
      where: { id },
      select: { creatorId: true },
    })

    if (!existing) {
      throw new Error('Learning Object no encontrado')
    }

    if (existing.creatorId !== userId) {
      throw new Error('No tienes permisos para eliminar este contenido')
    }

    return prisma.learningObject.delete({
      where: { id },
    })
  }

  /**
   * Obtener un Learning Object por ID
   */
  static async getById(id: string, userId?: string) {
    const learningObject = await prisma.learningObject.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            educatorProfile: {
              select: {
                verified: true,
                tier: true,
                avgRating: true,
                totalRatings: true,
              },
            },
          },
        },
        prerequisites: {
          include: {
            toNode: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                difficultyLevel: true,
                duration: true,
              },
            },
          },
        },
        isPrerequisiteOf: {
          include: {
            fromNode: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                difficultyLevel: true,
                duration: true,
              },
            },
          },
        },
        questions: {
          where: { verified: true },
          select: {
            id: true,
            type: true,
            difficulty: true,
          },
          take: 5,
        },
        _count: {
          select: {
            questions: true,
            comments: true,
            notes: true,
            enrollments: true,
          },
        },
      },
    })

    if (!learningObject) {
      throw new Error('Learning Object no encontrado')
    }

    // Incrementar vistas (async, no bloqueante)
    if (userId) {
      prisma.learningObject
        .update({
          where: { id },
          data: { views: { increment: 1 } },
        })
        .catch(() => {}) // Ignore errors
    }

    return learningObject
  }

  /**
   * Búsqueda avanzada de Learning Objects
   */
  static async search(params: SearchLearningObjectsInput) {
    const {
      query,
      subject,
      topic,
      contentType,
      difficultyLevel,
      teachingStyle,
      curriculum,
      creatorId,
      published,
      limit,
      offset,
      sortBy,
      sortOrder,
    } = params

    // Construir where clause dinámicamente
    const where: Prisma.LearningObjectWhereInput = {
      ...(published !== undefined && { published }),
      ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
      ...(topic && { topic: { contains: topic, mode: 'insensitive' } }),
      ...(contentType && { contentType }),
      ...(difficultyLevel && { difficultyLevel }),
      ...(teachingStyle && { teachingStyle: { has: teachingStyle } }),
      ...(curriculum && { curriculum }),
      ...(creatorId && { creatorId }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { concepts: { hasSome: [query] } },
          { tags: { hasSome: [query] } },
        ],
      }),
    }

    const [results, total] = await Promise.all([
      prisma.learningObject.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              educatorProfile: {
                select: {
                  verified: true,
                  tier: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              comments: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      prisma.learningObject.count({ where }),
    ])

    return {
      results,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Obtener Learning Objects del usuario (como educador)
   */
  static async getByCreator(creatorId: string) {
    return prisma.learningObject.findMany({
      where: { creatorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            questions: true,
            comments: true,
            progress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Crear una arista en el grafo de conocimiento
   */
  static async createEdge(data: CreateKnowledgeEdgeInput, userId: string) {
    // Verificar que el usuario es el creador del OA origen
    const fromOA = await prisma.learningObject.findUnique({
      where: { id: data.fromId },
      select: { creatorId: true },
    })

    if (!fromOA) {
      throw new Error('Learning Object origen no encontrado')
    }

    if (fromOA.creatorId !== userId) {
      throw new Error('No tienes permisos para crear esta conexión')
    }

    return prisma.knowledgeEdge.create({
      data,
      include: {
        fromNode: {
          select: {
            id: true,
            title: true,
          },
        },
        toNode: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
  }

  /**
   * Obtener estadísticas del educador
   */
  static async getEducatorStats(userId: string) {
    const [
      totalOAs,
      totalViews,
      totalEnrollments,
      avgRating,
      recentActivity,
    ] = await Promise.all([
      prisma.learningObject.count({
        where: { creatorId: userId },
      }),
      prisma.learningObject.aggregate({
        where: { creatorId: userId },
        _sum: { views: true },
      }),
      prisma.enrollment.count({
        where: {
          learningObject: {
            creatorId: userId,
          },
        },
      }),
      prisma.learningObject.aggregate({
        where: { creatorId: userId },
        _avg: { avgRating: true },
      }),
      prisma.learningObject.findMany({
        where: { creatorId: userId },
        select: {
          id: true,
          title: true,
          views: true,
          completions: true,
          avgRating: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    return {
      totalOAs,
      totalViews: totalViews._sum.views || 0,
      totalEnrollments,
      avgRating: avgRating._avg.avgRating || 0,
      recentActivity,
    }
  }

  /**
   * Obtener alternativas de un Learning Object (mismo tema, diferentes profesores)
   */
  static async getAlternatives(id: string, limit = 5) {
    const current = await prisma.learningObject.findUnique({
      where: { id },
      select: {
        subject: true,
        topic: true,
        creatorId: true,
        difficultyLevel: true,
      },
    })

    if (!current) return []

    return prisma.learningObject.findMany({
      where: {
        id: { not: id },
        subject: current.subject,
        topic: current.topic,
        difficultyLevel: current.difficultyLevel,
        published: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            educatorProfile: {
              select: {
                verified: true,
                tier: true,
                avgRating: true,
              },
            },
          },
        },
      },
      orderBy: [
        { avgRating: 'desc' },
        { views: 'desc' },
      ],
      take: limit,
    })
  }
}
