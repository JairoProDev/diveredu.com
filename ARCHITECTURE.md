# Arquitectura de DiverEdu

## Visión General

DiverEdu está construido sobre una arquitectura moderna de microservicios con un frontend Next.js 14 y múltiples backends especializados. La clave de nuestra ventaja competitiva reside en el **Grafo de Conocimiento Dinámico** y el **Motor de Personalización con IA**.

## Principios de Diseño

1. **Modularidad**: Cada componente es independiente y puede escalar por separado
2. **Datos como Ventaja Competitiva**: Cada interacción alimenta el modelo de personalización
3. **Performance First**: Optimizado para millones de usuarios concurrentes
4. **Developer Experience**: Código limpio, documentado y mantenible

## Stack Tecnológico Detallado

### Frontend
```
Next.js 14 (App Router)
├── TypeScript (Type Safety)
├── TailwindCSS (Styling)
├── Shadcn/ui (Component Library)
├── Framer Motion (Animations)
├── Zustand (State Management)
└── React Hook Form (Forms)
```

### Backend
```
Next.js API Routes
├── NextAuth.js (Authentication)
├── Prisma (ORM para PostgreSQL)
├── Mongoose (ODM para MongoDB)
└── Zod (Validation)
```

### Bases de Datos

#### PostgreSQL (Relacional)
**Responsabilidad**: Datos estructurados y relacionales

**Tablas Principales**:
- `users` - Usuarios del sistema
- `learning_objects` - Nodos del grafo (OAs)
- `knowledge_edges` - Aristas del grafo (relaciones entre OAs)
- `learning_paths` - Rutas de aprendizaje curadas
- `achievements` - Logros y badges del sistema de gamificación
- `educator_profiles` - Perfiles de educadores con analytics

**Por qué PostgreSQL**:
- ACID compliance para datos críticos (usuarios, monetización)
- Excelentes índices para búsquedas complejas
- JSON support para metadata flexible
- Escalabilidad vertical y horizontal

#### MongoDB (Documentos)
**Responsabilidad**: Datos flexibles y de alto volumen

**Colecciones Principales**:
- `user_progress` - Progreso detallado de cada usuario
- `collaborative_notes` - Apuntes con sistema de fork
- `analytics_events` - Eventos de tracking
- `ai_recommendations` - Cache de recomendaciones de IA

**Por qué MongoDB**:
- Schema flexible para datos en evolución
- Alta velocidad de escritura para tracking
- Fácil almacenamiento de estructuras complejas (apuntes, progreso)

#### Neo4j (Futuro - Grafo)
**Responsabilidad**: Grafo de conocimiento optimizado

**Por qué migrar a Neo4j**:
- Consultas de travesía ultra-rápidas
- Algoritmos de grafos nativos (PageRank, shortest path)
- Visualización de relaciones
- Motor de recomendación más potente

## El Grafo de Conocimiento

### Estructura

```
Objeto de Aprendizaje (Nodo)
├── Metadata Enriquecida
│   ├── contentType: VIDEO | ARTICLE | SIMULATION | GAME
│   ├── difficultyLevel: BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
│   ├── teachingStyle: THEORETICAL | PRACTICAL | ANALOGICAL | VISUAL
│   ├── concepts: string[] (tags de conceptos)
│   └── curriculum: alineación con sistemas educativos
├── Stats de Engagement
│   ├── views, completions, avgCompletionRate
│   └── avgRating, totalRatings
└── Relaciones (Aristas)
    ├── PREREQUISITE → este OA requiere dominar otro primero
    ├── ALTERNATIVE → explicación alternativa del mismo concepto
    ├── DEEPDIVE → profundización en un subtema
    ├── PRACTICAL → caso práctico o aplicación
    └── RELATED → contenido relacionado
```

### Algoritmo de Recomendación (V1 - MVP)

```typescript
function findOptimalPath(
  currentConcept: string,
  targetConcept: string,
  userProfile: UserProfile
): LearningObject[] {
  // 1. Encontrar todos los caminos posibles (BFS/DFS)
  const allPaths = graphTraversal(currentConcept, targetConcept)

  // 2. Scoring de cada camino
  const scoredPaths = allPaths.map(path => ({
    path,
    score: calculatePathScore(path, userProfile)
  }))

  // 3. Seleccionar el mejor
  return scoredPaths.sort((a, b) => b.score - a.score)[0].path
}

function calculatePathScore(
  path: LearningObject[],
  userProfile: UserProfile
): number {
  let score = 0

  // Factor 1: Estilo de Aprendizaje (30%)
  score += matchLearningStyle(path, userProfile.learningStyle) * 0.3

  // Factor 2: Nivel de Dificultad (25%)
  score += matchDifficultyProgression(path, userProfile.level) * 0.25

  // Factor 3: Engagement Histórico (20%)
  score += matchHistoricalEngagement(path, userProfile.history) * 0.2

  // Factor 4: Calidad del Contenido (15%)
  score += averageRating(path) * 0.15

  // Factor 5: Longitud del Camino (10%)
  score += pathEfficiency(path.length) * 0.1

  return score
}
```

### Algoritmo de Recomendación (V2 - ML)

En la segunda iteración, implementaremos un modelo de **Collaborative Filtering** + **Content-Based Filtering** híbrido:

```
User Embeddings + OA Embeddings
├── Entrenamiento con datos históricos
│   ├── Qué OAs completó cada usuario
│   ├── Tiempo de permanencia
│   ├── Quizzes completados exitosamente
│   └── Feedback explícito (ratings)
├── Modelo de Deep Learning
│   ├── User Tower: transforma perfil de usuario en vector denso
│   ├── OA Tower: transforma metadata de OA en vector denso
│   └── Dot Product: similitud entre usuario y OA
└── Predicción: prob(user completa OA)
```

## Sistema de Gamificación

### Arquitectura de XP y Niveles

```typescript
// Sistema de Eventos
enum GameEvent {
  VIDEO_COMPLETED = 50,
  QUIZ_PASSED = 100,
  QUIZ_PERFECT = 200,
  STREAK_DAY = 25,
  STREAK_WEEK = 200,
  HELPED_PEER = 75,
  NOTE_FORKED = 50,
  ACHIEVEMENT_UNLOCKED = variable
}

// Cálculo de Nivel
// Fórmula: nivel = floor(sqrt(xp / 100)) + 1
// Nivel 1: 0 XP
// Nivel 2: 100 XP
// Nivel 3: 400 XP
// Nivel 4: 900 XP
// Nivel 10: 8100 XP

// Progresión no lineal para mantener engagement a largo plazo
```

### Sistema de Logros

Los logros se verifican mediante **Event Sourcing**:

1. Cada acción del usuario genera un evento
2. Los eventos se almacenan en MongoDB
3. Un worker periódico verifica si se cumplen condiciones de logros
4. Al desbloquear, se otorga XP y se notifica al usuario

**Ejemplos de Logros**:
- **Racha de Fuego**: 7/30/100 días consecutivos
- **Maestro del Concepto**: Dominar un concepto (quiz perfecto + crear contenido)
- **Colaborador**: Que tus apuntes sean forkeados 10/50/100 veces
- **Todoterreno**: Completar rutas en 5 disciplinas diferentes

## Interfaz de Aprendizaje

### Componentes de la Pizarra

```
┌────────────────────────────────────────────────────────────┐
│ [← Back] [Subject] > [Topic] > [Concept]      [@Profile]  │
├───────┬────────────────────────────────────────────────────┤
│       │                                                    │
│  S    │               VIDEO PLAYER                         │
│  I    │         (Objeto de Aprendizaje Principal)          │
│  L    │                                                    │
│  L    ├────────────────────────────────────────────────────┤
│  A    │ Alternative Explanations [carousel]                │
│  B    │  [Prof A] [Prof B] [Prof C] [More...]            │
│  U    ├────────────────────────────────────────────────────┤
│  S    │ Tabs: [Summary] [Notes] [Comments] [Resources]    │
│       │                                                    │
│  • Progress │  [Content of selected tab]                      │
│  • Current  │                                                    │
│  • Next     │                                                    │
│       │                                                    │
└───────┴────────────────────────────────────────────────────┘
                     [TRY Button - Floating]
```

### Estados de la Interfaz

1. **Loading**: Skeleton screens mientras carga el contenido
2. **Viewing**: Consumo del OA principal
3. **Exploring**: Navegación por alternativas
4. **Practicing**: Sección TRY activada
5. **Completed**: Confetti animation + XP gained

## Sección TRY - Banco de Preguntas

### Fuentes de Preguntas

```typescript
enum QuestionSource {
  CREATOR_AUTHORED,    // Profesor creó la pregunta
  STUDENT_QUESTION,    // Estudiante preguntó en comentarios
  AI_GENERATED,        // IA generó basándose en contenido
  COMMUNITY_VERIFIED   // Pregunta verificada por la comunidad
}
```

### Flujo de Preguntas del Estudiante → Material de Práctica

1. Estudiante escribe pregunta en comentarios
2. IA analiza y categoriza la pregunta
3. Se añade al banco con `verified: false`
4. Otros estudiantes la ven como práctica
5. Después de 100 respuestas, la IA analiza el consenso
6. Si hay > 80% de acuerdo, se marca como verificada
7. Pregunta entra en rotación oficial

### Tipos de Quiz

```typescript
interface Question {
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK'
        | 'DRAG_DROP' | 'CONNECT' | 'CODE' | 'OPEN_ENDED'
  difficulty: DifficultyLevel
  concepts: string[] // Qué conceptos evalúa
  correctAnswer: string | object
  explanation: string
}
```

## Apuntes Colaborativos (Git-Style)

### Modelo de Fork

```typescript
interface Note {
  id: string
  learningObjectId: string
  userId: string
  title: string
  content: string // Markdown
  format: 'MARKDOWN' | 'CORNELL' | 'MINDMAP'
  forkedFromId: string | null
  forkCount: number
  likes: number
  isPublic: boolean
}

// Operaciones
- fork(noteId) → crea copia editable
- commit(noteId, changes) → guarda cambios
- merge(noteId, targetId) → combina cambios (manual)
- diff(noteId1, noteId2) → muestra diferencias
```

### Plantillas de Apuntes

1. **Método Cornell**: División en Notas, Conceptos Clave, Resumen
2. **Mapa Mental**: Interfaz de drag-drop para crear nodos
3. **Flashcards**: Frente y reverso automáticos
4. **Outline**: Lista jerárquica estructurada

## Sistema de Comentarios

### Tipos y Filtrado

```typescript
enum CommentType {
  OPINION,       // Opinión sobre el contenido
  QUESTION,      // Pregunta que necesita respuesta
  CONTRIBUTION,  // Aporte adicional (ej: ejemplo extra)
  FEEDBACK,      // Feedback para el educador
  CHAT,          // Conversación entre estudiantes
  BOOKMARK       // Marcador temporal en video
}

// Filtros
- Por tipo
- Por timestamp (anclado al video)
- Por likes
- Por "sin responder" (para preguntas)
```

### Threading

Soportamos hilos de conversación:
```
Comment A
├── Reply A.1
│   └── Reply A.1.1
└── Reply A.2
```

## Dashboard de Educadores

### Métricas Clave

```typescript
interface EducatorAnalytics {
  // Alcance
  totalViews: number
  uniqueStudents: number
  totalWatchTime: number // minutos

  // Engagement
  avgCompletionRate: number // %
  avgRating: number // 1-5
  commentCount: number

  // Efectividad
  avgQuizScore: number // % de estudiantes que pasan quiz
  retentionRate: number // % que vuelve a ver más contenido

  // Monetización
  monthlyEarnings: number
  totalEarnings: number
  rpm: number // Revenue per Mille (mil views)

  // Crecimiento
  growthRate: number // % mes a mes
  topPerformingOAs: LearningObject[]
}
```

### Sistema de Tiers

- **Bronze**: Cualquier educador que sube contenido
- **Silver**: > 1000 views + avg rating > 4.0
- **Gold**: > 10000 views + avg rating > 4.5 + verified expert

**Beneficios por Tier**:
- Bronze: RPM base
- Silver: RPM 1.5x + badge verificado
- Gold: RPM 2x + prioridad en recomendaciones + herramientas IA premium

## Integración con el Ecosistema

### PublicAdis (Monetización)

```typescript
// DiverEdu envía contexto al ad server
interface AdContext {
  userId: string
  currentOA: LearningObject
  subject: string
  topic: string
  userLevel: number
  userInterests: string[]
}

// PublicAdis devuelve anuncios relevantes
interface AdResponse {
  ads: Ad[]
  targeting: {
    educational: boolean
    relevant: boolean
    ageAppropriate: boolean
  }
}
```

**Tipos de Anuncios**:
1. **Pre-roll**: Antes del video (skippable después de 5s)
2. **Mid-roll**: En videos > 10 min
3. **Display**: Sidebar (no intrusivo)
4. **Native**: Cursos relacionados de otros educadores

### Buscadis (Empleabilidad)

```typescript
interface SkillProfile {
  userId: string
  verifiedSkills: Array<{
    skill: string
    level: DifficultyLevel
    proofOfWork: {
      coursesCompleted: string[]
      quizScores: number[]
      projectsBuilt: string[]
      timeInvested: number // horas
    }
    confidence: number // 0-1, basado en ML
  }>
}

// DiverEdu → Buscadis
// Cuando un estudiante completa una ruta de aprendizaje,
// se crea/actualiza su SkillProfile en Buscadis
//
// Buscadis → DiverEdu
// Ofertas de empleo pueden sugerir rutas de aprendizaje
// para adquirir skills faltantes
```

## Seguridad y Privacidad

### Autenticación
- NextAuth.js con JWT
- Soporte para OAuth (Google, GitHub)
- Credenciales tradicionales (email/password)
- 2FA (futuro)

### Autorización
```typescript
enum Permission {
  CREATE_OA,
  EDIT_OWN_OA,
  DELETE_OWN_OA,
  MODERATE_COMMENTS,
  VIEW_ANALYTICS,
  VERIFY_CONTENT
}

// Role-Based Access Control (RBAC)
STUDENT → [CREATE_NOTE, ANSWER_QUIZ]
EDUCATOR → [CREATE_OA, VIEW_ANALYTICS, EDIT_OWN_OA]
ADMIN → [ALL_PERMISSIONS]
```

### Datos Sensibles
- Passwords hasheados con bcrypt
- Datos de pago encriptados
- PII (Personally Identifiable Information) cumple con GDPR/LGPD
- Anonimización de datos para ML

## Performance y Escalabilidad

### Caching Strategy

```
┌─────────────────┐
│   CDN (Vercel)  │ → Videos, imágenes, assets estáticos
├─────────────────┤
│   Redis         │ → Rutas de aprendizaje pre-calculadas
│                 │   Datos de sesión
│                 │   Leaderboards
├─────────────────┤
│ In-Memory Cache │ → Consultas frecuentes de DB
└─────────────────┘
```

### Database Optimization

**PostgreSQL**:
- Índices en columnas de búsqueda frecuente
- Particionamiento de tablas grandes (progress, answers)
- Read replicas para queries analíticas

**MongoDB**:
- Índices compuestos para queries complejas
- Sharding por userId para distribuir carga

### API Rate Limiting

```typescript
// Por usuario
const userRateLimit = {
  window: '15m',
  max: 100 // requests
}

// Por IP (para usuarios no autenticados)
const ipRateLimit = {
  window: '15m',
  max: 50
}
```

## Monitoreo y Observabilidad

### Métricas Clave (KPIs)

**Producto**:
- DAU / MAU (Daily/Monthly Active Users)
- Retention Rate (D1, D7, D30)
- Time to First Completion (TTFC)
- NPS (Net Promoter Score)

**Técnicas**:
- API Response Time (p50, p95, p99)
- Error Rate
- Database Query Performance
- CDN Hit Rate

### Alertas

```yaml
Critical:
  - Error rate > 1%
  - API response time p95 > 500ms
  - Database connection pool exhausted

Warning:
  - Signup conversion < 5%
  - OA completion rate < 30%
  - Daily active educators < 100
```

## Testing Strategy

```
Unit Tests (Jest)
├── Utils y helpers
├── Algoritmos de recomendación
└── Funciones de cálculo (XP, levels)

Integration Tests (Playwright)
├── Flujos de autenticación
├── Creación de OAs
├── Sistema de quiz
└── Gamificación

E2E Tests (Playwright)
├── Flujo completo de estudiante
├── Flujo completo de educador
└── Integración con PublicAdis/Buscadis
```

## Deployment

### Environments

1. **Development**: Local
2. **Staging**: Vercel Preview
3. **Production**: Vercel Production + Railway (DBs)

### CI/CD Pipeline

```
Push to branch
↓
GitHub Actions
├── Run linter
├── Run tests
├── Build Next.js
└── Deploy to Vercel Preview
↓
Merge to main
↓
Deploy to Production
├── Database migrations (Prisma)
├── Clear caches
└── Notify team
```

## Conclusión

Esta arquitectura está diseñada para:
1. **Escalar** de 100 a 10M de usuarios
2. **Evolucionar** incorporando IA más avanzada
3. **Mantener** la velocidad de desarrollo alta
4. **Garantizar** la mejor experiencia de usuario

No estamos construyendo otro clon de Udemy. Estamos construyendo el **sistema operativo de la educación del futuro**.
