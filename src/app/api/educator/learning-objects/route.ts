import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LearningObjectService } from '@/lib/services/learning-object.service'

/**
 * GET /api/educator/learning-objects
 * Obtener todos los Learning Objects del educador actual
 */
export async function GET() {
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
        { error: 'Solo educadores pueden acceder a este contenido' },
        { status: 403 }
      )
    }

    const learningObjects = await LearningObjectService.getByCreator(session.user.id)

    return NextResponse.json({
      learningObjects,
      total: learningObjects.length,
    })
  } catch (error) {
    console.error('Error al obtener Learning Objects:', error)
    return NextResponse.json(
      { error: 'Error al obtener contenido' },
      { status: 500 }
    )
  }
}
