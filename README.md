# DiverEdu - La Singularidad del Aprendizaje Humano

![DiverEdu Logo](https://via.placeholder.com/800x200/8b5cf6/ffffff?text=DiverEdu+-+El+Futuro+del+Aprendizaje)

**Democratizando el conocimiento universal con IA, gamificación y personalización radical.**

DiverEdu es una plataforma educativa revolucionaria que combina lo mejor de YouTube, Duolingo, Wikipedia y GitHub para crear la experiencia de aprendizaje más personalizada, efectiva y adictiva del mundo.

## 🎯 Visión

Crear un ecosistema global de conocimiento donde:
- Cualquier persona pueda enseñar y compartir su conocimiento
- Cada estudiante tenga un "Dream Team" de educadores personalizados
- El aprendizaje sea tan adictivo como los videojuegos
- La educación de calidad sea gratuita y accesible para todos

## 🚀 Características Principales

### 1. **Grafo de Conocimiento Dinámico**
No más cursos rígidos. El conocimiento se organiza en un grafo vivo de conceptos interconectados que crea rutas de aprendizaje personalizadas en tiempo real.

### 2. **IA Hiper-Personalizada**
- **Dream Team de Educadores**: La IA selecciona al mejor profesor para cada concepto específico basándose en tu estilo de aprendizaje
- **Rutas Adaptativas**: El sistema ajusta dinámicamente el contenido según tu progreso
- **Tutor 24/7**: Chatbot inteligente que responde dudas específicas del contenido

### 3. **Gamificación Adictiva**
- Sistema de XP y niveles
- Rachas diarias (streaks)
- Batallas de conocimiento en tiempo real
- Olimpiadas y competencias globales
- Insignias y logros desbloqueables

### 4. **Sección TRY - Aprendizaje Activo**
- Banco de preguntas colaborativo
- Múltiples formatos: opción múltiple, arrastrar y soltar, código, etc.
- Feedback instantáneo
- Las dudas de estudiantes se convierten automáticamente en material de práctica

### 5. **Apuntes Colaborativos (Estilo GitHub)**
- Sistema de "fork" para apuntes
- Versiones y control de cambios
- Plantillas para diferentes métodos (Cornell, mapas mentales, etc.)
- Compartible en redes sociales

### 6. **Ecosistema Integrado**
- **PublicAdis**: Monetización ética con publicidad educativa
- **Buscadis**: Conexión directa con oportunidades laborales basadas en habilidades verificadas

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui
- Framer Motion

**Backend:**
- Next.js API Routes
- NextAuth.js (Autenticación)

**Bases de Datos:**
- PostgreSQL + Prisma (Datos relacionales, metadata de OAs, grafo de conocimiento)
- MongoDB (Progreso de usuarios, apuntes, datos flexibles)

**Futuro:**
- Neo4j (Grafo de conocimiento optimizado)
- Redis (Cache y sesiones)
- AWS S3 (Almacenamiento de medios)

### Modelo de Datos Clave

#### Objeto de Aprendizaje (OA)
```typescript
{
  id: string
  title: string
  content: string
  contentType: VIDEO | ARTICLE | SIMULATION | GAME | QUIZ
  difficultyLevel: BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
  teachingStyle: THEORETICAL | PRACTICAL | ANALOGICAL | VISUAL
  concepts: string[] // Tags de conceptos que enseña
  prerequisites: KnowledgeEdge[] // Relaciones en el grafo
}
```

#### Knowledge Edge (Arista del Grafo)
```typescript
{
  fromId: string // OA origen
  toId: string // OA destino
  edgeType: PREREQUISITE | ALTERNATIVE | DEEPDIVE | PRACTICAL
  weight: number // Para algoritmos de recomendación
}
```

## 🔄 Flujo de Usuario

### Para Estudiantes:
1. **Diagnóstico Inicial**: Evaluación de estilo de aprendizaje e intereses
2. **Exploración**: Descubre contenido mediante el grafo o búsqueda
3. **Aprendizaje**: Consume OAs con la interfaz de pizarra interactiva
4. **Práctica**: Sección TRY para verificar conocimiento
5. **Progreso**: Sistema de gamificación y tracking automático

### Para Educadores:
1. **Creación de Contenido**: Herramientas no-code para crear OAs
2. **Conexión al Grafo**: Vincular contenido con prerrequisitos y conceptos
3. **Colaboración**: Participar en resúmenes y recursos colectivos
4. **Monetización**: Ganar dinero basado en consumo y efectividad del contenido
5. **Analytics**: Dashboard con métricas de impacto

## 📊 Modelo de Negocio

### Freemium
- **Gratis**: Acceso ilimitado a contenido con publicidad de PublicAdis
- **Premium Estudiantes**: Sin ads, herramientas avanzadas, certificaciones
- **Premium Educadores**: Mejores comisiones, herramientas de IA avanzadas

### Monetización de Educadores
- Reparto de ingresos por publicidad (RPM)
- Suscripciones premium a cursos especializados
- Propinas y donaciones directas
- Marketplace de recursos

## 🎯 Diferenciadores Clave (Nuestro Océano Azul)

1. **Desagregación del Curso**: Rompemos el modelo de "curso monolítico". Aprendizaje granular y personalizado.
2. **Dream Team de Educadores**: El mejor profesor para cada concepto, no un solo profesor para todo.
3. **Grafo de Conocimiento vs. Lista de Reproducción**: Rutas infinitas y dinámicas, no secuencias fijas.
4. **Aprendizaje Activo Verificado**: Medimos dominio, no horas de video vistas.
5. **Ecosistema Cerrado**: Educación → Empleo (con Buscadis)

## 🛣️ Roadmap

### Fase 1: MVP (Meses 1-6)
- [x] Configuración base del proyecto
- [x] Schema de base de datos con grafo de conocimiento
- [x] Componentes UI base
- [ ] Sistema de autenticación (estudiantes/educadores)
- [ ] CRUD de Objetos de Aprendizaje
- [ ] Interfaz de visualización (pizarra + sidebar)
- [ ] Sección TRY básica
- [ ] Gamificación inicial (XP, niveles, rachas)

### Fase 2: Beachhead Market (Meses 7-12)
- [ ] Motor de recomendación básico
- [ ] Apuntes colaborativos (fork system)
- [ ] Sistema de comentarios con subdivisiones
- [ ] Dashboard de educadores
- [ ] Integración con PublicAdis
- [ ] Lanzamiento en nicho específico (ej: admisión UNI Perú)

### Fase 3: Expansión (Año 2)
- [ ] IA avanzada de personalización
- [ ] Integración con Buscadis
- [ ] Migración a Neo4j para el grafo
- [ ] Simulaciones y laboratorios virtuales
- [ ] Sistema de certificaciones con blockchain
- [ ] Expansión a otros países LATAM

### Fase 4: Singularidad (Año 3+)
- [ ] Proyecto JARVIS (IA que aprende a enseñar)
- [ ] VR/AR para aprendizaje inmersivo
- [ ] B2B para empresas y gobiernos
- [ ] DiverEdu OS (plataforma abierta para desarrolladores)

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/JairoProDev/diveredu.com.git
cd diveredu.com
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Edita .env con tus credenciales
```

4. **Configurar base de datos**
```bash
# Genera el cliente de Prisma
npm run db:generate

# Ejecuta las migraciones
npm run db:migrate

# (Opcional) Seed de datos iniciales
npm run db:seed
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run db:generate` - Genera cliente de Prisma
- `npm run db:push` - Push del schema a la BD
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:seed` - Seed de datos

## 🤝 Contribución

DiverEdu es un proyecto ambicioso que busca revolucionar la educación global. Las contribuciones son bienvenidas.

### Áreas de Contribución
- **Desarrollo Frontend/Backend**
- **Diseño UI/UX**
- **Ciencia de Datos / ML**
- **Creación de Contenido Educativo**
- **Traducción e Internacionalización**

### Proceso
1. Fork del repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Pendiente de definición (considerando open-source con restricciones comerciales)

## 🌟 El Futuro

DiverEdu no es solo una plataforma, es un movimiento. Estamos construyendo la infraestructura del conocimiento para la próxima generación.

**No vine aquí para competir. Vine a ganar y cambiar el mundo.**

---

**Construido con ❤️ y ambición ilimitada por el equipo de DiverEdu**

[Website](https://diveredu.com) | [Twitter](https://twitter.com/diveredu) | [LinkedIn](https://linkedin.com/company/diveredu)
