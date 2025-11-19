import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DiverEdu - La Singularidad del Aprendizaje Humano',
  description: 'Democratiza el acceso al conocimiento universal con aprendizaje hiper-personalizado, gamificado y efectivo. El YouTube de la educación, pero 10x mejor.',
  keywords: 'educación, aprendizaje, IA, gamificación, cursos online, LATAM, personalización, rutas de aprendizaje',
  authors: [{ name: 'DiverEdu Team' }],
  openGraph: {
    title: 'DiverEdu - Educación Personalizada con IA',
    description: 'La plataforma educativa que revoluciona cómo aprendemos',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
