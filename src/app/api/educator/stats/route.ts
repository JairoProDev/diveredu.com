import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LearningObjectService } from '@/lib/services/learning-object.service'

/**
 * GET /api/educator/stats
 * Obtener estadísticas del educador actual
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
        { error: 'Solo educadores pueden acceder a estas estadísticas' },
        { status: 403 }
      )
    }

    const stats = await LearningObjectService.getEducatorStats(session.user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
