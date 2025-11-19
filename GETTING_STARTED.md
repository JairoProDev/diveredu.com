# Getting Started con DiverEdu

¡Bienvenido a DiverEdu! Este documento te guiará en la configuración inicial y los próximos pasos del desarrollo.

## 🎉 Lo que ya está construido

### ✅ Infraestructura Base
- **Next.js 14** con App Router y TypeScript configurado
- **TailwindCSS** con sistema de diseño completo y modo oscuro
- **Shadcn/ui** componentes UI de alta calidad
- Estructura de proyecto escalable y bien organizada

### ✅ Autenticación Completa
- **NextAuth.js** configurado con soporte para:
  - Credenciales (email/password)
  - OAuth (Google, GitHub) - listo para activar
- Páginas de login y registro funcionales
- Sistema de roles (STUDENT, EDUCATOR, ADMIN)
- Sistema de tiers (FREE, PREMIUM, ENTERPRISE)

### ✅ Modelo de Datos (Prisma Schema)
El schema completo del MVP está definido en `prisma/schema.prisma`:

- **Users & Auth**: Sistema de usuarios con gamificación integrada
- **Learning Objects (OAs)**: Nodos del grafo de conocimiento
- **Knowledge Edges**: Aristas que conectan OAs (prerrequisitos, alternativas, etc.)
- **Learning Paths**: Rutas de aprendizaje curadas
- **Gamification**: XP, niveles, rachas, achievements
- **Questions & Answers**: Banco de preguntas colaborativo (Sección TRY)
- **Comments**: Sistema de comentarios con threading
- **Notes**: Apuntes colaborativos estilo GitHub
- **Educator Profiles**: Analytics y monetización

### ✅ Documentación
- **README.md**: Visión completa del proyecto y roadmap
- **ARCHITECTURE.md**: Arquitectura técnica detallada
- **Este archivo**: Guía de inicio rápido

## 🚀 Configuración del Entorno

### 1. Instalar Dependencias

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

### 2. Configurar Bases de Datos

#### PostgreSQL (Datos Relacionales)

**Opción A: Docker (Recomendado para desarrollo)**

```bash
docker run --name diveredu-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=diveredu \
  -p 5432:5432 \
  -d postgres:14
```

**Opción B: PostgreSQL Local**

Instala PostgreSQL 14+ y crea la base de datos:

```sql
CREATE DATABASE diveredu;
```

#### MongoDB (Datos Flexibles)

**Opción A: Docker**

```bash
docker run --name diveredu-mongo \
  -p 27017:27017 \
  -d mongo:6
```

**Opción B: MongoDB Local**

Instala MongoDB 6+ o usa MongoDB Atlas (cloud).

### 3. Configurar Variables de Entorno

Ya existe un archivo `.env` con valores por defecto. Actualízalo según tu configuración:

```bash
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diveredu?schema=public"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/diveredu"

# NextAuth
NEXTAUTH_SECRET="cambia-este-secret-en-produccion"
```

### 4. Inicializar la Base de Datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas (push del schema)
npm run db:push

# O usar migraciones (recomendado para producción)
npm run db:migrate
```

### 5. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📂 Estructura del Proyecto

```
diveredu.com/
├── prisma/
│   └── schema.prisma          # Modelo de datos completo
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   └── auth/         # Endpoints de autenticación
│   │   ├── auth/             # Páginas de auth (login, register)
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Estilos globales
│   ├── components/
│   │   ├── ui/               # Componentes UI (shadcn/ui)
│   │   └── providers.tsx     # Providers (Auth, Theme)
│   ├── lib/
│   │   ├── auth.ts           # Configuración NextAuth
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── mongodb.ts        # Cliente MongoDB
│   │   └── utils.ts          # Utilidades
│   └── types/
│       └── next-auth.d.ts    # Types de NextAuth
├── README.md
├── ARCHITECTURE.md
└── GETTING_STARTED.md (este archivo)
```

## 🎯 Próximos Pasos del MVP

### Fase 1: CRUD de Learning Objects (En Progreso)

**Objetivo**: Permitir a educadores crear y gestionar objetos de aprendizaje.

**Tareas**:
1. Crear dashboard para educadores (`/dashboard/educator`)
2. Formulario de creación de Learning Objects
3. Sistema de subida de videos (YouTube embed inicial)
4. Gestión de metadata (tags, nivel, estilo de enseñanza)
5. Preview del contenido antes de publicar

**Archivos a crear**:
- `src/app/dashboard/educator/page.tsx`
- `src/app/dashboard/educator/create/page.tsx`
- `src/app/api/learning-objects/route.ts`
- `src/components/learning-object-form.tsx`

### Fase 2: Interfaz de Visualización (Pizarra)

**Objetivo**: Crear la experiencia de aprendizaje para estudiantes.

**Tareas**:
1. Página de visualización de Learning Object
2. Sidebar con silabus y progreso
3. Integración de video player
4. Sistema de navegación entre OAs relacionados
5. Sección de recursos y resumen

**Archivos a crear**:
- `src/app/learn/[oaId]/page.tsx`
- `src/components/learning-object-viewer.tsx`
- `src/components/sidebar-progress.tsx`

### Fase 3: Sección TRY (Gamificación)

**Objetivo**: Sistema de práctica y verificación de conocimiento.

**Tareas**:
1. Componente de quiz interactivo
2. Banco de preguntas por OA
3. Sistema de scoring y feedback
4. Integración con sistema de XP
5. Visualización de progreso

**Archivos a crear**:
- `src/components/try-section.tsx`
- `src/app/api/questions/route.ts`
- `src/app/api/answers/route.ts`
- `src/components/quiz-player.tsx`

### Fase 4: Motor de Recomendación Básico

**Objetivo**: Recomendar OAs basándose en el grafo de conocimiento.

**Tareas**:
1. Algoritmo de travesía del grafo (BFS/DFS)
2. Sistema de scoring simple
3. API endpoint de recomendaciones
4. Integración en la UI

**Archivos a crear**:
- `src/lib/recommendation-engine.ts`
- `src/app/api/recommendations/route.ts`

### Fase 5: Dashboard de Estudiantes

**Objetivo**: Mostrar progreso, logros y rutas personalizadas.

**Tareas**:
1. Vista de progreso general
2. Sistema de rachas y XP
3. Visualización de logros
4. Rutas de aprendizaje recomendadas

**Archivos a crear**:
- `src/app/dashboard/student/page.tsx`
- `src/components/gamification-stats.tsx`
- `src/components/achievement-grid.tsx`

## 🧪 Testing y Desarrollo

### Seed de Datos (Opcional pero Recomendado)

Crea `prisma/seed.ts` para poblar la DB con datos de prueba:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario educador
  const educator = await prisma.user.create({
    data: {
      email: 'educator@diveredu.com',
      name: 'María García',
      password: await bcrypt.hash('password123', 12),
      role: 'EDUCATOR',
      tier: 'FREE',
      xp: 0,
      level: 1,
    },
  })

  // Crear perfil de educador
  await prisma.educatorProfile.create({
    data: {
      userId: educator.id,
      verified: true,
      tier: 'GOLD',
    },
  })

  // Crear usuario estudiante
  await prisma.user.create({
    data: {
      email: 'student@diveredu.com',
      name: 'Carlos Pérez',
      password: await bcrypt.hash('password123', 12),
      role: 'STUDENT',
      tier: 'FREE',
      xp: 250,
      level: 3,
      currentStreak: 5,
    },
  })

  // Crear algunos Learning Objects de ejemplo
  const oa1 = await prisma.learningObject.create({
    data: {
      title: 'Introducción a Álgebra',
      description: 'Aprende los fundamentos del álgebra',
      contentType: 'VIDEO',
      difficultyLevel: 'BEGINNER',
      teachingStyle: ['VISUAL', 'PRACTICAL'],
      subject: 'Matemáticas',
      topic: 'Álgebra',
      concepts: ['variables', 'ecuaciones'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      published: true,
      creatorId: educator.id,
    },
  })

  console.log('✅ Seed completado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Ejecutar seed:
```bash
npm run db:seed
```

### Prisma Studio (Explorar la DB)

```bash
npm run db:studio
```

Abre una interfaz visual en `http://localhost:5555` para explorar y editar datos.

## 🔧 Utilidades y Comandos

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build            # Build de producción
npm run start            # Servidor de producción

# Base de datos
npm run db:generate      # Genera cliente de Prisma
npm run db:push          # Push del schema (dev)
npm run db:migrate       # Crear migración (prod)
npm run db:studio        # Interfaz visual de la DB
npm run db:seed          # Poblar con datos de prueba

# Linting
npm run lint             # Ejecutar ESLint
```

## 🎨 Convenciones de Código

### Componentes
- Usar `'use client'` solo cuando sea necesario (interactividad)
- Preferir Server Components por defecto
- Colocar componentes reutilizables en `src/components/`
- Componentes de página en `src/app/`

### API Routes
- Validar con Zod antes de procesar
- Retornar errores descriptivos
- Usar HTTP status codes correctos

### Naming
- Archivos: `kebab-case` (ej: `learning-object-form.tsx`)
- Componentes: `PascalCase` (ej: `LearningObjectForm`)
- Funciones: `camelCase` (ej: `calculateLevel`)
- Constantes: `UPPER_SNAKE_CASE` (ej: `MAX_XP_PER_LEVEL`)

## 🐛 Troubleshooting

### Error: Cannot find module '@prisma/client'

```bash
npm run db:generate
```

### Error: Database connection failed

Verifica que PostgreSQL y MongoDB estén corriendo:

```bash
# PostgreSQL
docker ps | grep diveredu-postgres

# MongoDB
docker ps | grep diveredu-mongo
```

### Error: NextAuth secret missing

Asegúrate de tener `NEXTAUTH_SECRET` en tu `.env`

## 📚 Recursos

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contribución

Este es tu proyecto. Siéntete libre de experimentar, romper cosas y reconstruirlas mejor.

**Recuerda**: No estás construyendo un clon de Udemy. Estás construyendo el futuro de la educación.

---

**¿Listo para continuar? Comienza con el CRUD de Learning Objects.**

```bash
# Crea tu primer branch de feature
git checkout -b feature/learning-objects-crud

# Y empieza a construir el océano azul
```

**Vine a ganar. 🚀**
