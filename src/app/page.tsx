import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Brain,
  Trophy,
  Users,
  Zap,
  Globe,
  Rocket,
  Target,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              DiverEdu
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Comenzar Gratis</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              La Web4 de la Educación
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            La Singularidad del Aprendizaje Humano
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Democratizamos el conocimiento universal con IA, gamificación y personalización radical.
            <br />
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              No buscas un curso. Encuentras a tu profesor perfecto.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=student">
              <Button size="lg" className="w-full sm:w-auto">
                <BookOpen className="mr-2 h-5 w-5" />
                Empezar a Aprender
              </Button>
            </Link>
            <Link href="/auth/register?role=educator">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Empezar a Enseñar
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            ✨ Gratis para siempre. Sin tarjeta de crédito.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <FeatureCard
            icon={<Brain className="h-10 w-10" />}
            title="IA Hiper-Personalizada"
            description="Tu Dream Team de profesores. La IA encuentra al mejor educador para cada concepto específico que necesitas aprender."
            color="purple"
          />
          <FeatureCard
            icon={<Trophy className="h-10 w-10" />}
            title="Gamificación Adictiva"
            description="XP, rachas, batallas de conocimiento y olimpiadas. Aprender nunca fue tan divertido como tus videojuegos favoritos."
            color="blue"
          />
          <FeatureCard
            icon={<Target className="h-10 w-10" />}
            title="Sección TRY"
            description="Practica con preguntas colaborativas y verifica tu aprendizaje con feedback instantáneo. El conocimiento se demuestra, no solo se consume."
            color="purple"
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10" />}
            title="Grafo de Conocimiento"
            description="No más cursos rígidos. Navegas por una red viva de conceptos interconectados que se adapta a tu ritmo y estilo."
            color="blue"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="Apuntes Colaborativos"
            description="Sistema estilo GitHub para tus apuntes. Haz fork, mejora y comparte el conocimiento con la comunidad."
            color="purple"
          />
          <FeatureCard
            icon={<Rocket className="h-10 w-10" />}
            title="Ecosistema Integrado"
            description="Conectado con PublicAdis y Buscadis. Aprende, monetiza y encuentra empleo, todo en un solo lugar."
            color="blue"
          />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para la revolución educativa?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de estudiantes y educadores que ya están construyendo el futuro del aprendizaje.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">DiverEdu</span>
              <span className="text-sm text-gray-500">© 2024</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/about" className="hover:text-primary">Acerca de</Link>
              <Link href="/how-it-works" className="hover:text-primary">Cómo Funciona</Link>
              <Link href="/educators" className="hover:text-primary">Para Educadores</Link>
              <Link href="/contact" className="hover:text-primary">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'purple' | 'blue'
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
