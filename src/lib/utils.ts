import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula el nivel basado en XP
 */
export function calculateLevel(xp: number): number {
  // Fórmula: nivel = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

/**
 * Calcula el XP necesario para el siguiente nivel
 */
export function xpForNextLevel(currentLevel: number): number {
  // Fórmula inversa: xp = (nivel^2) * 100
  return Math.pow(currentLevel, 2) * 100
}

/**
 * Calcula el progreso hacia el siguiente nivel
 */
export function calculateLevelProgress(currentXP: number): {
  currentLevel: number
  xpForCurrent: number
  xpForNext: number
  progressPercent: number
} {
  const currentLevel = calculateLevel(currentXP)
  const xpForCurrent = xpForNextLevel(currentLevel - 1)
  const xpForNext = xpForNextLevel(currentLevel)
  const xpInLevel = currentXP - xpForCurrent
  const xpNeededForLevel = xpForNext - xpForCurrent
  const progressPercent = (xpInLevel / xpNeededForLevel) * 100

  return {
    currentLevel,
    xpForCurrent,
    xpForNext,
    progressPercent: Math.min(progressPercent, 100),
  }
}

/**
 * Formatea duración en segundos a formato legible
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

/**
 * Extrae el ID de video de YouTube de una URL
 */
export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Genera un color basado en un string (para avatares, badges, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

/**
 * Trunca texto a una longitud máxima
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Formatea números grandes (1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Calcula tiempo de lectura estimado (palabras por minuto)
 */
export function calculateReadingTime(text: string, wpm: number = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wpm)
}
