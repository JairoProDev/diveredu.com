'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Sparkles,
  Video,
  BookOpen,
  Gamepad2,
  Mic,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createLearningObjectSchema, CreateLearningObjectInput } from '@/lib/validations/learning-object'
import { extractYouTubeId } from '@/lib/utils'

const CONTENT_TYPES = [
  { value: 'VIDEO', label: 'Video', icon: Video },
  { value: 'ARTICLE', label: 'Artículo', icon: FileText },
  { value: 'SIMULATION', label: 'Simulación', icon: Sparkles },
  { value: 'GAME', label: 'Juego', icon: Gamepad2 },
  { value: 'PODCAST', label: 'Podcast', icon: Mic },
  { value: 'QUIZ', label: 'Quiz', icon: BookOpen },
]

const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Principiante', color: 'bg-green-100 text-green-800' },
  { value: 'INTERMEDIATE', label: 'Intermedio', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ADVANCED', label: 'Avanzado', color: 'bg-orange-100 text-orange-800' },
  { value: 'EXPERT', label: 'Experto', color: 'bg-red-100 text-red-800' },
]

const TEACHING_STYLES = [
  { value: 'THEORETICAL', label: 'Teórico' },
  { value: 'PRACTICAL', label: 'Práctico' },
  { value: 'ANALOGICAL', label: 'Analógico' },
  { value: 'HISTORICAL', label: 'Histórico' },
  { value: 'VISUAL', label: 'Visual' },
  { value: 'INTERACTIVE', label: 'Interactivo' },
]

export default function CreateLearningObject() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTeachingStyles, setSelectedTeachingStyles] = useState<string[]>([])
  const [concepts, setConcepts] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [conceptInput, setConceptInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateLearningObjectInput>({
    resolver: zodResolver(createLearningObjectSchema),
    defaultValues: {
      contentType: 'VIDEO',
      difficultyLevel: 'BEGINNER',
      language: 'es',
      published: false,
      teachingStyle: [],
      concepts: [],
      tags: [],
    },
  })

  const videoUrl = watch('videoUrl')
  const contentType = watch('contentType')

  const toggleTeachingStyle = (style: string) => {
    const updated = selectedTeachingStyles.includes(style)
      ? selectedTeachingStyles.filter((s) => s !== style)
      : [...selectedTeachingStyles, style]
    setSelectedTeachingStyles(updated)
    setValue('teachingStyle', updated as any)
  }

  const addConcept = () => {
    if (conceptInput.trim() && !concepts.includes(conceptInput.trim())) {
      const updated = [...concepts, conceptInput.trim()]
      setConcepts(updated)
      setValue('concepts', updated)
      setConceptInput('')
    }
  }

  const removeConcept = (concept: string) => {
    const updated = concepts.filter((c) => c !== concept)
    setConcepts(updated)
    setValue('concepts', updated)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const updated = [...tags, tagInput.trim()]
      setTags(updated)
      setValue('tags', updated)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag)
    setTags(updated)
    setValue('tags', updated)
  }

  const onSubmit = async (data: CreateLearningObjectInput) => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/learning-objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Error al crear contenido')
      }

      toast.success(
        data.published
          ? '¡Contenido publicado exitosamente!'
          : '¡Borrador guardado exitosamente!'
      )

      router.push('/dashboard/educator')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al crear contenido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/educator">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Crear Contenido Educativo</h1>
                <p className="text-sm text-muted-foreground">
                  Comparte tu conocimiento con el mundo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Detalles fundamentales de tu contenido educativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Introducción al Álgebra para Principiantes"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe qué aprenderán los estudiantes, qué temas se cubrirán y por qué es importante..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Tipo de Contenido */}
              <div className="space-y-2">
                <Label>
                  Tipo de Contenido <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CONTENT_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        contentType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        {...register('contentType')}
                        className="sr-only"
                      />
                      <type.icon className="h-5 w-5" />
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* URL de Video (solo si es VIDEO) */}
              {contentType === 'VIDEO' && (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">
                    URL del Video (YouTube) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...register('videoUrl')}
                  />
                  {errors.videoUrl && (
                    <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
                  )}
                  {videoUrl && getYouTubeThumbnail(videoUrl) && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Vista Previa:</p>
                      <img
                        src={getYouTubeThumbnail(videoUrl)!}
                        alt="Vista previa del video"
                        className="rounded-lg w-full max-w-md"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Duración */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (en minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="15"
                  {...register('duration', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata Pedagógica */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata Pedagógica</CardTitle>
              <CardDescription>
                Ayuda a la IA a recomendar tu contenido a los estudiantes correctos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nivel de Dificultad */}
              <div className="space-y-2">
                <Label>
                  Nivel de Dificultad <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        watch('difficultyLevel') === level.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={level.value}
                        {...register('difficultyLevel')}
                        className="sr-only"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
                        {level.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estilos de Enseñanza */}
              <div className="space-y-2">
                <Label>
                  Estilos de Enseñanza <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona todos los que apliquen
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TEACHING_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => toggleTeachingStyle(style.value)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedTeachingStyles.includes(style.value)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                {errors.teachingStyle && (
                  <p className="text-sm text-destructive">{errors.teachingStyle.message}</p>
                )}
              </div>

              {/* Tema y Subtema */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Tema <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Ej: Matemáticas"
                    {...register('subject')}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">
                    Subtema <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="Ej: Álgebra"
                    {...register('topic')}
                  />
                  {errors.topic && (
                    <p className="text-sm text-destructive">{errors.topic.message}</p>
                  )}
                </div>
              </div>

              {/* Conceptos */}
              <div className="space-y-2">
                <Label>
                  Conceptos Clave <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los conceptos específicos que se enseñan (ej: variables, ecuaciones)
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar concepto..."
                    value={conceptInput}
                    onChange={(e) => setConceptInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcept())}
                  />
                  <Button type="button" onClick={addConcept} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {concepts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {concepts.map((concept) => (
                      <Badge
                        key={concept}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/10"
                        onClick={() => removeConcept(concept)}
                      >
                        {concept}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.concepts && (
                  <p className="text-sm text-destructive">{errors.concepts.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags (Opcional)</Label>
                <p className="text-sm text-muted-foreground">
                  Palabras clave adicionales para búsqueda
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="gap-1 cursor-pointer hover:bg-primary/80"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="outline"
                onClick={() => setValue('published', false)}
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Borrador
              </Button>
              <Button
                type="submit"
                onClick={() => setValue('published', true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Publicando...'
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publicar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
