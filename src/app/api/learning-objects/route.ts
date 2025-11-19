import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LearningObjectService } from '@/lib/services/learning-object.service'
import {
  createLearningObjectSchema,
  searchLearningObjectsSchema,
} from '@/lib/validations/learning-object'
import { z } from 'zod'

/**
 * GET /api/learning-objects
 * Búsqueda y listado de Learning Objects con filtros avanzados
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    // Parsear query params
    const params = {
      query: searchParams.get('query') || undefined,
      subject: searchParams.get('subject') || undefined,
      topic: searchParams.get('topic') || undefined,
      contentType: searchParams.get('contentType') || undefined,
      difficultyLevel: searchParams.get('difficultyLevel') || undefined,
      teachingStyle: searchParams.get('teachingStyle') || undefined,
      curriculum: searchParams.get('curriculum') || undefined,
      creatorId: searchParams.get('creatorId') || undefined,
      published: searchParams.get('published') === 'true' ? true : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }

    // Validar params
    const validatedParams = searchLearningObjectsSchema.parse(params)

    // Ejecutar búsqueda
    const results = await LearningObjectService.search(validatedParams)

    return NextResponse.json(results)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error en búsqueda de Learning Objects:', error)
    return NextResponse.json(
      { error: 'Error al buscar contenido' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/learning-objects
 * Crear un nuevo Learning Object (solo educadores)
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'EDUCATOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Solo educadores pueden crear contenido' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createLearningObjectSchema.parse(body)

    const learningObject = await LearningObjectService.create(
      validatedData,
      session.user.id
    )

    return NextResponse.json(
      {
        message: 'Learning Object creado exitosamente',
        learningObject,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear Learning Object:', error)
    return NextResponse.json(
      { error: 'Error al crear el contenido' },
      { status: 500 }
    )
  }
}
