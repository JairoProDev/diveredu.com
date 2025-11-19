'use client'

import { useEffect, useState } from 'react'
import { use} from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ReactPlayer from 'react-player/youtube'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
  FileText,
  Trophy,
  Play,
  Check,
  Lock,
  Star,
  Users,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDuration, formatNumber } from '@/lib/utils'

interface LearningObjectData {
  id: string
  title: string
  description: string
  content: string
  videoUrl: string
  contentType: string
  difficultyLevel: string
  teachingStyle: string[]
  subject: string
  topic: string
  concepts: string[]
  duration: number
  views: number
  avgRating: number
  totalRatings: number
  creator: {
    id: string
    name: string
    image: string
    educatorProfile: {
      verified: boolean
      tier: string
      avgRating: number
      totalRatings: number
    }
  }
  prerequisites: Array<{
    toNode: {
      id: string
      title: string
      thumbnailUrl: string
      difficultyLevel: string
      duration: number
    }
  }>
  isPrerequisiteOf: Array<{
    fromNode: {
      id: string
      title: string
      thumbnailUrl: string
      difficultyLevel: string
      duration: number
    }
  }>
  _count: {
    questions: number
    comments: number
    notes: number
    enrollments: number
  }
}

interface Alternative {
  id: string
  title: string
  creator: {
    id: string
    name: string
    image: string
    educatorProfile: {
      verified: boolean
      tier: string
      avgRating: number
    }
  }
  avgRating: number
  views: number
  duration: number
}

export default function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const [learningObject, setLearningObject] = useState<LearningObjectData | null>(null)
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    loadLearningObject()
    loadAlternatives()
  }, [resolvedParams.id])

  const loadLearningObject = async () => {
    try {
      const res = await fetch(`/api/learning-objects/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setLearningObject(data)
      } else {
        toast.error('No se pudo cargar el contenido')
      }
    } catch (error) {
      toast.error('Error al cargar el contenido')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAlternatives = async () => {
    try {
      const res = await fetch(`/api/learning-objects/${resolvedParams.id}/alternatives`)
      if (res.ok) {
        const data = await res.json()
        setAlternatives(data.alternatives)
      }
    } catch (error) {
      console.error('Error loading alternatives:', error)
    }
  }

  const handleProgress = ({ played }: { played: number }) => {
    setCurrentProgress(played * 100)
    if (!hasStarted && played > 0) {
      setHasStarted(true)
      // TODO: Track start event
    }
  }

  const handleComplete = () => {
    toast.success('¡Completaste esta lección!')
    // TODO: Track completion and award XP
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  if (!learningObject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Contenido no encontrado</h2>
          <p className="text-muted-foreground mb-4">
            El contenido que buscas no existe o fue eliminado
          </p>
          <Link href="/explore">
            <Button>Explorar Contenido</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content Grid */}
      <div className="flex">
        {/* Video Section */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            {learningObject.contentType === 'VIDEO' && learningObject.videoUrl ? (
              <ReactPlayer
                url={learningObject.videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                onProgress={handleProgress}
                onEnded={handleComplete}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                  },
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video no disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Below Video */}
          <div className="bg-background p-6">
            {/* Title and Creator */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{learningObject.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(learningObject.views)} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {formatNumber(learningObject._count.enrollments)} estudiantes
                    </span>
                    {learningObject.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(learningObject.duration * 60)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {learningObject.avgRating.toFixed(1)} ({learningObject.totalRatings})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge>{learningObject.difficultyLevel}</Badge>
                  <Badge variant="outline">{learningObject.contentType}</Badge>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={learningObject.creator.image} />
                  <AvatarFallback>{learningObject.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{learningObject.creator.name}</p>
                    {learningObject.creator.educatorProfile.verified && (
                      <Badge className="gap-1">
                        <Check className="h-3 w-3" />
                        Verificado
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {learningObject.creator.educatorProfile.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ⭐ {learningObject.creator.educatorProfile.avgRating.toFixed(1)} · {learningObject.creator.educatorProfile.totalRatings} valoraciones
                  </p>
                </div>
                <Button variant="outline">Seguir</Button>
              </div>
            </div>

            {/* Progress Bar */}
            {hasStarted && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Tu progreso</span>
                  <span className="font-medium">{currentProgress.toFixed(0)}%</span>
                </div>
                <Progress value={currentProgress} className="h-2" />
              </div>
            )}

            {/* Floating TRY Button */}
            <div className="mb-6">
              <Button
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Trophy className="h-5 w-5" />
                PRACTICAR - Pon a Prueba tu Conocimiento
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Alternative Explanations */}
            {alternatives.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Explicaciones Alternativas
                  <span className="text-sm text-muted-foreground font-normal">
                    (Mismo tema, diferentes profesores)
                  </span>
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {alternatives.map((alt) => (
                    <Link key={alt.id} href={`/learn/${alt.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-2">{alt.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={alt.creator.image} />
                              <AvatarFallback>{alt.creator.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {alt.creator.name}
                            </span>
                            {alt.creator.educatorProfile.verified && (
                              <Check className="h-3 w-3 text-primary" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {alt.avgRating.toFixed(1)}
                            </span>
                            <span>{formatNumber(alt.views)} vistas</span>
                            {alt.duration && <span>{formatDuration(alt.duration * 60)}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs: Summary, Resources, Comments, Notes */}
            <Tabs defaultValue="summary" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
                <TabsTrigger value="comments">
                  Comentarios ({learningObject._count.comments})
                </TabsTrigger>
                <TabsTrigger value="notes">
                  Apuntes ({learningObject._count.notes})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Descripción</h3>
                  <p>{learningObject.description}</p>

                  <h3>Conceptos Clave</h3>
                  <div className="flex flex-wrap gap-2 not-prose">
                    {learningObject.concepts.map((concept) => (
                      <Badge key={concept} variant="secondary">
                        {concept}
                      </Badge>
                    ))}
                  </div>

                  <h3>Estilos de Enseñanza</h3>
                  <div className="flex flex-wrap gap-2 not-prose">
                    {learningObject.teachingStyle.map((style) => (
                      <Badge key={style}>{style}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay recursos adicionales disponibles</p>
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sé el primero en comentar</p>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Crea tus primeros apuntes</p>
                  <Button className="mt-4">Crear Apunte</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar - Learning Path */}
        {isSidebarOpen && (
          <div className="w-80 bg-background border-l overflow-y-auto max-h-screen">
            <div className="p-4 border-b sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Ruta de Aprendizaje</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                2 de 6 completados
              </p>
            </div>

            <div className="p-4 space-y-2">
              {/* Prerequisites */}
              {learningObject.prerequisites.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    PRERREQUISITOS
                  </h3>
                  {learningObject.prerequisites.map((prereq) => (
                    <Link
                      key={prereq.toNode.id}
                      href={`/learn/${prereq.toNode.id}`}
                      className="block"
                    >
                      <div className="p-3 rounded-lg border mb-2 hover:bg-muted cursor-pointer">
                        <div className="flex items-start gap-2">
                          <Lock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">
                              {prereq.toNode.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {prereq.toNode.difficultyLevel} · {formatDuration(prereq.toNode.duration * 60)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Current */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  ACTUAL
                </h3>
                <div className="p-3 rounded-lg bg-primary/10 border-2 border-primary">
                  <div className="flex items-start gap-2">
                    <Play className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">
                        {learningObject.title}
                      </p>
                      <Progress value={currentProgress} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {learningObject.isPrerequisiteOf.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    SIGUIENTE
                  </h3>
                  {learningObject.isPrerequisiteOf.map((next) => (
                    <Link
                      key={next.fromNode.id}
                      href={`/learn/${next.fromNode.id}`}
                      className="block"
                    >
                      <div className="p-3 rounded-lg border mb-2 hover:bg-muted cursor-pointer">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 mt-0.5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">
                              {next.fromNode.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {next.fromNode.difficultyLevel} · {formatDuration(next.fromNode.duration * 60)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-20"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
