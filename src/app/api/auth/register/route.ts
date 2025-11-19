import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['STUDENT', 'EDUCATOR']).default('STUDENT'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = registerSchema.parse(body)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        tier: 'FREE',
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
      },
    })

    // Si es educador, crear su perfil de educador
    if (role === 'EDUCATOR') {
      await prisma.educatorProfile.create({
        data: {
          userId: user.id,
          verified: false,
          tier: 'BRONZE',
          totalEarnings: 0,
          monthlyEarnings: 0,
          totalViews: 0,
          totalCompletions: 0,
          avgRating: 0,
          totalRatings: 0,
        },
      })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error al crear la cuenta. Por favor, intenta de nuevo.' },
      { status: 500 }
    )
  }
}
