'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Trophy,
  Flame,
  Zap,
  Target,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  Play,
} from 'lucide-react'
import { calculateLevelProgress } from '@/lib/utils'

interface Recommendation {
  id: string
  title: string
  score: number
  reason: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (session?.user?.role === 'EDUCATOR') {
      router.push('/dashboard/educator')
    } else {
      loadDashboard()
    }
  }, [session, status, router])

  const loadDashboard = async () => {
    try {
      const res = await fetch('/api/recommendations?limit=5')
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  const userXP = session.user?.xp || 0
  const levelProgress = calculateLevelProgress(userXP)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mi Aprendizaje
              </h1>
              <p className="text-muted-foreground mt-1">
                Bienvenido de vuelta, {session.user.name}
              </p>
            </div>
            <Link href="/explore">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Explorar Contenido
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Nivel</p>
                      <p className="text-4xl font-bold">{levelProgress.currentLevel}</p>
                    </div>
                    <Trophy className="h-12 w-12 opacity-80" />
                  </div>
                  <div className="mt-4">
                    <Progress value={levelProgress.progressPercent} className="h-2 bg-purple-400" />
                    <p className="text-xs text-purple-100 mt-1">
                      {Math.floor(levelProgress.progressPercent)}% al nivel {levelProgress.currentLevel + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Racha</p>
                      <p className="text-4xl font-bold">{session.user.currentStreak || 0}</p>
                    </div>
                    <Flame className="h-12 w-12 opacity-80" />
                  </div>
                  <p className="text-xs text-orange-100 mt-4">
                    {session.user.currentStreak ? `¡${session.user.currentStreak} días consecutivos!` : 'Comienza tu racha hoy'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">XP Total</p>
                      <p className="text-4xl font-bold">{userXP.toLocaleString()}</p>
                    </div>
                    <Zap className="h-12 w-12 opacity-80" />
                  </div>
                  <p className="text-xs text-blue-100 mt-4">
                    +{Math.floor(Math.random() * 100)} esta semana
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recomendado Para Ti
                </CardTitle>
                <CardDescription>
                  Contenido personalizado basado en tu perfil de aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Aún no hay recomendaciones. Comienza a aprender para obtener contenido personalizado.
                    </p>
                    <Link href="/explore">
                      <Button>Explorar Contenido</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <Link
                        key={rec.id}
                        href={`/learn/${rec.id}`}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            <Play className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.reason}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {Math.round(rec.score)}% match
                            </Badge>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Continuar Aprendiendo
                </CardTitle>
                <CardDescription>
                  Retoma donde lo dejaste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tienes contenido en progreso</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={session.user.image || ''} />
                    <AvatarFallback className="text-2xl">
                      {session.user.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mb-1">{session.user.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{session.user.email}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className="gap-1">
                      <Trophy className="h-3 w-3" />
                      Nivel {levelProgress.currentLevel}
                    </Badge>
                    <Badge variant="outline">{session.user.tier}</Badge>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="w-full">
                      Editar Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Primera Racha</p>
                      <p className="text-xs text-muted-foreground">Completa 3 días seguidos</p>
                    </div>
                  </div>
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Desbloquea más logros aprendiendo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Tabla de Clasificación
                </CardTitle>
                <CardDescription className="text-xs">
                  Esta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((position) => (
                    <div
                      key={position}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-xs font-bold">
                        {position}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U{position}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Usuario {position}</p>
                        <p className="text-xs text-muted-foreground">
                          {5000 - position * 500} XP
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Ver Tabla Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
