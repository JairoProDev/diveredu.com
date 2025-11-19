import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RecommendationService } from '@/lib/services/recommendation.service'

/**
 * GET /api/recommendations
 * Obtener recomendaciones personalizadas para el usuario actual
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10

    const recommendations = await RecommendationService.getRecommendations(
      session.user.id,
      limit
    )

    return NextResponse.json({
      recommendations,
      total: recommendations.length,
    })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Error al generar recomendaciones' },
      { status: 500 }
    )
  }
}
