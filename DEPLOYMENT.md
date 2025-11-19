# Deployment Guide - DiverEdu

Esta guía te ayudará a desplegar DiverEdu en producción.

## 🚀 Stack de Despliegue Recomendado

### Frontend & Backend
- **Vercel** - Deploy automático desde GitHub
- **Railway** - Bases de datos PostgreSQL y MongoDB

### Alternativas
- **AWS**: EC2 + RDS + DocumentDB
- **DigitalOcean**: App Platform + Managed Databases
- **Render**: Web Services + PostgreSQL

## 📋 Pre-requisitos

1. Cuenta en Vercel
2. Cuenta en Railway (o proveedor de bases de datos)
3. Repositorio en GitHub
4. Credenciales de OAuth (Google, GitHub) - Opcional

## 🗄️ Configurar Bases de Datos

### PostgreSQL en Railway

1. Crea un nuevo proyecto en Railway
2. Add > Database > PostgreSQL
3. Copia la `DATABASE_URL` desde las variables de entorno

### MongoDB en Railway

1. En el mismo proyecto de Railway
2. Add > Database > MongoDB
3. Copia la `MONGO_URL` como `MONGODB_URI`

### Alternativa: Bases de Datos Gratuitas

**PostgreSQL**:
- Supabase (500MB gratis)
- Neon (10GB gratis)
- ElephantSQL (20MB gratis - solo para testing)

**MongoDB**:
- MongoDB Atlas (512MB gratis)

## 🔧 Configurar Variables de Entorno

En Vercel, ve a Settings > Environment Variables y agrega:

```bash
# Bases de Datos
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...

# NextAuth
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=genera-un-secret-aleatorio-aqui

# OAuth (Opcional)
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret

# Futuro
PUBLICADIS_API_KEY=
BUSCADIS_API_KEY=
OPENAI_API_KEY=
```

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🚢 Deploy en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Push tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Import Project > Select tu repositorio
4. Vercel detectará Next.js automáticamente
5. Agrega las variables de entorno
6. Deploy!

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 📊 Migrar Base de Datos

Una vez desplegado, ejecuta las migraciones:

```bash
# Localmente, apuntando a la BD de producción
DATABASE_URL="tu-production-url" npx prisma migrate deploy
```

O usa Prisma Data Platform para ejecutar migraciones automáticamente.

## 🔐 Configurar OAuth

### Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. APIs & Services > Credentials > Create Credentials > OAuth Client ID
4. Application type: Web application
5. Authorized redirect URIs:
   - `https://tu-dominio.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (dev)
6. Copia Client ID y Client Secret

### GitHub OAuth

1. Ve a GitHub > Settings > Developer settings > OAuth Apps
2. New OAuth App
3. Authorization callback URL:
   - `https://tu-dominio.vercel.app/api/auth/callback/github`
4. Copia Client ID y Client Secret

## 🎯 Post-Deployment

### 1. Verificar Deploy

Visita: `https://tu-dominio.vercel.app`

Prueba:
- ✅ Homepage carga correctamente
- ✅ Registro de usuario funciona
- ✅ Login funciona
- ✅ Dashboard carga sin errores

### 2. Seed de Datos (Opcional)

```bash
# Crear algunos usuarios y contenido de prueba
DATABASE_URL="tu-production-url" npm run db:seed
```

### 3. Monitoreo

Vercel incluye:
- Analytics de visitantes
- Logs en tiempo real
- Error tracking

Considera agregar:
- **Sentry** para error tracking avanzado
- **LogRocket** para session replay
- **Google Analytics** para analytics de usuario

## 🔍 Troubleshooting

### Error: Database connection failed

- Verifica que las URLs de las bases de datos sean correctas
- Asegúrate de que las bases de datos permitan conexiones desde la IP de Vercel
- En Railway, las bases de datos están disponibles públicamente por defecto

### Error: NEXTAUTH_SECRET missing

- Asegúrate de haber agregado `NEXTAUTH_SECRET` en Vercel
- Regenera el secret con `openssl rand -base64 32`

### Error: Build failed

- Revisa los logs en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que el build pase localmente: `npm run build`

### Error: Prisma Client not generated

En Vercel, agrega el siguiente script al `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## 🌍 Dominio Personalizado

1. Ve a Settings > Domains en Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel
4. Actualiza `NEXTAUTH_URL` con tu nuevo dominio

## 📈 Escalamiento

### Cuando llegues a 1000+ usuarios

**Base de Datos**:
- Migra a un plan de pago en Railway
- O migra a RDS/DocumentDB en AWS
- Considera connection pooling con PgBouncer

**Caché**:
- Agrega Redis para sesiones y caché
- Upstash Redis tiene un plan gratuito

**CDN**:
- Vercel ya incluye CDN global
- Para videos, considera CloudFront o Bunny CDN

**Búsqueda**:
- Implementa Algolia o Meilisearch para búsqueda avanzada

### Cuando llegues a 10,000+ usuarios

**Grafo de Conocimiento**:
- Migra a Neo4j (tienen plan gratuito hasta 50k nodos)
- O implementa el grafo en PostgreSQL con extensión Age

**AI/ML**:
- Implementa el motor de recomendación avanzado con OpenAI embeddings
- Usa Pinecone para vector search

**Monitoreo**:
- DataDog o New Relic para APM
- PagerDuty para alertas

## 💰 Estimación de Costos (Mes 1-6)

**Opción Gratis (0-1000 usuarios)**:
- Vercel: Gratis (Hobby)
- Railway: $5/mes (bases de datos pequeñas)
- Total: ~$5/mes

**Opción Startup (1000-10000 usuarios)**:
- Vercel Pro: $20/mes
- Railway: $20-50/mes (bases de datos con más recursos)
- Redis (Upstash): $10/mes
- Total: ~$50-80/mes

**Opción Growth (10000+ usuarios)**:
- Vercel Pro: $20/mes
- AWS RDS + DocumentDB: $100-200/mes
- Redis: $20/mes
- Neo4j: $50/mes
- CDN: $50/mes
- Total: ~$240-340/mes

## 🔒 Seguridad en Producción

- [ ] Habilita 2FA en todas las cuentas (Vercel, Railway, GitHub)
- [ ] Rota `NEXTAUTH_SECRET` periódicamente
- [ ] Implementa rate limiting en las APIs
- [ ] Configura CORS correctamente
- [ ] Habilita HTTPS (Vercel lo hace automáticamente)
- [ ] Configura CSP headers
- [ ] Implementa logging de eventos de seguridad

## 📝 Checklist Pre-Launch

- [ ] Todas las variables de entorno configuradas
- [ ] Migraciones de BD ejecutadas
- [ ] Seed de datos de prueba (opcional)
- [ ] SSL/HTTPS funcionando
- [ ] OAuth configurado y probado
- [ ] Error tracking configurado (Sentry)
- [ ] Analytics configurado (Google Analytics)
- [ ] Dominio personalizado configurado
- [ ] Performance testado (PageSpeed Insights)
- [ ] Backup de bases de datos configurado
- [ ] Monitoreo de uptime configurado

## 🎊 Launch!

Una vez que todo esté listo:

1. Anuncia en redes sociales
2. Invita a los primeros beta users
3. Monitorea logs y errores los primeros días
4. Recolecta feedback
5. Itera rápido

---

**¿Necesitas ayuda?** Revisa la documentación completa en:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

**¡Buena suerte con el lanzamiento! 🚀**
