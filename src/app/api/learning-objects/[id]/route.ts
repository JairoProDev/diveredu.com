import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LearningObjectService } from '@/lib/services/learning-object.service'
import { updateLearningObjectSchema } from '@/lib/validations/learning-object'
import { z } from 'zod'

/**
 * GET /api/learning-objects/[id]
 * Obtener un Learning Object por ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const learningObject = await LearningObjectService.getById(
      params.id,
      session?.user?.id
    )

    return NextResponse.json(learningObject)
  } catch (error: any) {
    if (error.message === 'Learning Object no encontrado') {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      )
    }

    console.error('Error al obtener Learning Object:', error)
    return NextResponse.json(
      { error: 'Error al obtener el contenido' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/learning-objects/[id]
 * Actualizar un Learning Object
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateLearningObjectSchema.parse(body)

    const learningObject = await LearningObjectService.update(
      params.id,
      validatedData,
      session.user.id
    )

    return NextResponse.json({
      message: 'Learning Object actualizado exitosamente',
      learningObject,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (
      error.message === 'Learning Object no encontrado' ||
      error.message === 'No tienes permisos para editar este contenido'
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('permisos') ? 403 : 404 }
      )
    }

    console.error('Error al actualizar Learning Object:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el contenido' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/learning-objects/[id]
 * Eliminar un Learning Object
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    await LearningObjectService.delete(params.id, session.user.id)

    return NextResponse.json({
      message: 'Learning Object eliminado exitosamente',
    })
  } catch (error: any) {
    if (
      error.message === 'Learning Object no encontrado' ||
      error.message === 'No tienes permisos para eliminar este contenido'
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('permisos') ? 403 : 404 }
      )
    }

    console.error('Error al eliminar Learning Object:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el contenido' },
      { status: 500 }
    )
  }
}
