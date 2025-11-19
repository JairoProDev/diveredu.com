import { z } from 'zod'

// Enums
export const ContentTypeEnum = z.enum([
  'VIDEO',
  'ARTICLE',
  'SIMULATION',
  'GAME',
  'PODCAST',
  'QUIZ',
  'PROJECT',
  'LIVE_SESSION',
])

export const DifficultyLevelEnum = z.enum([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
])

export const TeachingStyleEnum = z.enum([
  'THEORETICAL',
  'PRACTICAL',
  'ANALOGICAL',
  'HISTORICAL',
  'VISUAL',
  'INTERACTIVE',
])

export const EdgeTypeEnum = z.enum([
  'PREREQUISITE',
  'ALTERNATIVE',
  'DEEPDIVE',
  'PRACTICAL',
  'RELATED',
  'NEXT',
])

// Schema de creación de Learning Object
export const createLearningObjectSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres').max(5000),
  content: z.string().optional(),
  videoUrl: z.string().url('URL de video inválida').optional().or(z.literal('')),
  thumbnailUrl: z.string().url('URL de thumbnail inválida').optional().or(z.literal('')),
  duration: z.number().int().positive().optional(),

  // Metadata
  contentType: ContentTypeEnum,
  difficultyLevel: DifficultyLevelEnum,
  teachingStyle: z.array(TeachingStyleEnum).min(1, 'Selecciona al menos un estilo de enseñanza'),
  language: z.string().default('es'),

  // Taxonomía
  subject: z.string().min(2, 'El tema debe tener al menos 2 caracteres'),
  topic: z.string().min(2, 'El subtema debe tener al menos 2 caracteres'),
  concepts: z.array(z.string()).min(1, 'Agrega al menos un concepto'),
  tags: z.array(z.string()).default([]),

  // Curriculum
  curriculum: z.string().optional(),
  gradeLevel: z.string().optional(),

  // Estado
  published: z.boolean().default(false),
})

export const updateLearningObjectSchema = createLearningObjectSchema.partial()

export const createKnowledgeEdgeSchema = z.object({
  fromId: z.string().cuid(),
  toId: z.string().cuid(),
  edgeType: EdgeTypeEnum,
  weight: z.number().min(0).max(1).default(1),
})

export const searchLearningObjectsSchema = z.object({
  query: z.string().optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  contentType: ContentTypeEnum.optional(),
  difficultyLevel: DifficultyLevelEnum.optional(),
  teachingStyle: TeachingStyleEnum.optional(),
  curriculum: z.string().optional(),
  creatorId: z.string().optional(),
  published: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'views', 'avgRating', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Types
export type CreateLearningObjectInput = z.infer<typeof createLearningObjectSchema>
export type UpdateLearningObjectInput = z.infer<typeof updateLearningObjectSchema>
export type CreateKnowledgeEdgeInput = z.infer<typeof createKnowledgeEdgeSchema>
export type SearchLearningObjectsInput = z.infer<typeof searchLearningObjectsSchema>
