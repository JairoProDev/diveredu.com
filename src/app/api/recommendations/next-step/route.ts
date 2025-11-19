import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RecommendationService } from '@/lib/services/recommendation.service'

/**
 * GET /api/recommendations/next-step?currentOAId=xxx
 * Obtener el siguiente paso recomendado basado en el OA actual
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
    const currentOAId = searchParams.get('currentOAId') || undefined

    const nextSteps = await RecommendationService.getNextStep(
      session.user.id,
      currentOAId
    )

    return NextResponse.json({
      nextSteps,
      total: nextSteps.length,
    })
  } catch (error) {
    console.error('Error getting next step:', error)
    return NextResponse.json(
      { error: 'Error al obtener siguiente paso' },
      { status: 500 }
    )
  }
}
