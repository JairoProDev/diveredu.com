'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Users,
  Eye,
  Star,
  TrendingUp,
  Plus,
  BarChart3,
  Video,
  Edit,
  Trash2,
  Globe,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatNumber, formatDuration } from '@/lib/utils'

interface EducatorStats {
  totalOAs: number
  totalViews: number
  totalEnrollments: number
  avgRating: number
  recentActivity: any[]
}

interface LearningObject {
  id: string
  title: string
  published: boolean
  views: number
  completions: number
  avgRating: number
  contentType: string
  difficultyLevel: string
  createdAt: string
  _count: {
    enrollments: number
    questions: number
    comments: number
    progress: number
  }
}

export default function EducatorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<EducatorStats | null>(null)
  const [learningObjects, setLearningObjects] = useState<LearningObject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (session?.user?.role !== 'EDUCATOR' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    } else {
      loadDashboardData()
    }
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      const [statsRes, oasRes] = await Promise.all([
        fetch('/api/educator/stats'),
        fetch('/api/educator/learning-objects'),
      ])

      if (statsRes.ok && oasRes.ok) {
        const statsData = await statsRes.json()
        const oasData = await oasRes.json()
        setStats(statsData)
        setLearningObjects(oasData.learningObjects)
      }
    } catch (error) {
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) return

    try {
      const res = await fetch(`/api/learning-objects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Contenido eliminado exitosamente')
        loadDashboardData()
      } else {
        toast.error('Error al eliminar el contenido')
      }
    } catch (error) {
      toast.error('Error al eliminar el contenido')
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/learning-objects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (res.ok) {
        toast.success(
          currentStatus ? 'Contenido despublicado' : 'Contenido publicado'
        )
        loadDashboardData()
      } else {
        toast.error('Error al actualizar el estado')
      }
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard de Educador
              </h1>
              <p className="text-muted-foreground mt-1">
                Bienvenido, {session?.user?.name}
              </p>
            </div>
            <Link href="/dashboard/educator/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Crear Contenido
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Contenidos Creados"
            value={stats?.totalOAs || 0}
            color="purple"
          />
          <StatCard
            icon={<Eye className="h-5 w-5" />}
            label="Total de Vistas"
            value={formatNumber(stats?.totalViews || 0)}
            color="blue"
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Estudiantes"
            value={formatNumber(stats?.totalEnrollments || 0)}
            color="green"
          />
          <StatCard
            icon={<Star className="h-5 w-5" />}
            label="Calificación Promedio"
            value={stats?.avgRating.toFixed(1) || '0.0'}
            color="yellow"
          />
        </div>

        {/* Content Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Mis Contenidos
            </CardTitle>
            <CardDescription>
              Administra tu contenido educativo y revisa su performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learningObjects.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aún no has creado contenido
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comienza a compartir tu conocimiento con el mundo
                </p>
                <Link href="/dashboard/educator/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Mi Primer Contenido
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {learningObjects.map((oa) => (
                  <div
                    key={oa.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{oa.title}</h3>
                          {oa.published ? (
                            <Badge variant="default" className="gap-1">
                              <Globe className="h-3 w-3" />
                              Publicado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Borrador</Badge>
                          )}
                          <Badge variant="outline">{oa.contentType}</Badge>
                          <Badge variant="outline">{oa.difficultyLevel}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>{formatNumber(oa.views)} vistas</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{formatNumber(oa._count.enrollments)} inscritos</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-4 w-4" />
                            <span>{oa.avgRating.toFixed(1)} / 5.0</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(oa.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {oa.views > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Tasa de Completitud</span>
                              <span>
                                {oa.views > 0
                                  ? ((oa.completions / oa.views) * 100).toFixed(1)
                                  : 0}
                                %
                              </span>
                            </div>
                            <Progress
                              value={oa.views > 0 ? (oa.completions / oa.views) * 100 : 0}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/educator/edit/${oa.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublish(oa.id, oa.published)}
                        >
                          <Globe
                            className={`h-4 w-4 ${
                              oa.published ? 'text-green-600' : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(oa.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-8 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">
              💡 Consejos para Educadores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              • Usa <strong>títulos descriptivos</strong> que incluyan las palabras clave
              del tema
            </p>
            <p>
              • Agrega <strong>múltiples estilos de enseñanza</strong> para alcanzar a más
              estudiantes
            </p>
            <p>
              • Crea <strong>preguntas de práctica</strong> para reforzar el aprendizaje
            </p>
            <p>
              • Mantén tus videos <strong>concisos</strong> (10-15 minutos idealmente)
            </p>
            <p>
              • Conecta tu contenido con <strong>prerrequisitos y profundizaciones</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'purple' | 'blue' | 'green' | 'yellow'
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
