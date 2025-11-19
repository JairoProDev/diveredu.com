'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Star,
  Eye,
  Clock,
  Users,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { formatNumber, formatDuration } from '@/lib/utils'

interface LearningObject {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  contentType: string
  difficultyLevel: string
  subject: string
  topic: string
  duration: number
  views: number
  avgRating: number
  creator: {
    name: string
    image: string
    educatorProfile: {
      verified: boolean
      tier: string
    }
  }
  _count: {
    enrollments: number
    comments: number
  }
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [learningObjects, setLearningObjects] = useState<LearningObject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
  }, [searchQuery, selectedSubject])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        published: 'true',
        limit: '20',
        ...(searchQuery && { query: searchQuery }),
        ...(selectedSubject && { subject: selectedSubject }),
      })

      const res = await fetch(`/api/learning-objects?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLearningObjects(data.results)
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subjects = ['Matemáticas', 'Ciencias', 'Programación', 'Idiomas', 'Historia', 'Arte']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Explora el Conocimiento
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Descubre contenido educativo de clase mundial
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar cursos, temas, conceptos..."
                className="pl-12 pr-4 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subjects Filter */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button
                variant={selectedSubject === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(null)}
              >
                Todos
              </Button>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BookOpen className="h-10 w-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">10,000+</p>
                  <p className="text-purple-100 text-sm">Contenidos Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">50,000+</p>
                  <p className="text-blue-100 text-sm">Estudiantes Aprendiendo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-10 w-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">1,000+</p>
                  <p className="text-green-100 text-sm">Educadores Verificados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando contenido...</p>
          </div>
        ) : learningObjects.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontró contenido</h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningObjects.map((oa) => (
              <Link key={oa.id} href={`/learn/${oa.id}`}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative aspect-video bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg overflow-hidden">
                    {oa.thumbnailUrl ? (
                      <img
                        src={oa.thumbnailUrl}
                        alt={oa.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className="bg-black/60 backdrop-blur-sm">
                        {oa.difficultyLevel}
                      </Badge>
                    </div>
                    {oa.duration && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(oa.duration * 60)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {oa.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {oa.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={oa.creator.image} />
                        <AvatarFallback>{oa.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {oa.creator.name}
                      </span>
                      {oa.creator.educatorProfile.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {oa.avgRating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(oa.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(oa._count.enrollments)}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {oa.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {oa.topic}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
