import { NextResponse } from 'next/server'
import { LearningObjectService } from '@/lib/services/learning-object.service'

/**
 * GET /api/learning-objects/[id]/alternatives
 * Obtener explicaciones alternativas del mismo concepto por otros profesores
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 5

    const alternatives = await LearningObjectService.getAlternatives(params.id, limit)

    return NextResponse.json({
      alternatives,
      count: alternatives.length,
    })
  } catch (error) {
    console.error('Error al obtener alternativas:', error)
    return NextResponse.json(
      { error: 'Error al obtener alternativas' },
      { status: 500 }
    )
  }
}
