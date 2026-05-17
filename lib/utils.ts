import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Periodo, ReportSetup } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtEur(n: number | undefined | null): string {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: n < 10 ? 2 : 0,
  }).format(n)
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat('es-ES').format(Math.round(n))
}

export function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`
}

export function periodLabel(periodo: Periodo): string {
  const end   = new Date()
  const start = new Date()
  start.setDate(start.getDate() - parseInt(periodo))

  const fmt = (d: Date) => d.toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
  return `${fmt(start)} – ${fmt(end)}`
}

export function scoreColor(score: number): {
  color:   string
  bg:      string
  border:  string
  label:   string
} {
  if (score >= 80) return { color: '#2D6A4F', bg: '#F0FAF4', border: '#2D6A4F', label: 'Excelente' }
  if (score >= 65) return { color: '#1A5276', bg: '#F0F8FF', border: '#1A5276', label: 'Sólido' }
  if (score >= 50) return { color: '#9B4819', bg: '#FEF9F0', border: '#9B4819', label: 'Mejorable' }
  return               { color: '#8B1A1A', bg: '#FFF5F5', border: '#8B1A1A', label: 'Atención requerida' }
}

export function extractJson(text: string): unknown {
  const first = text.indexOf('{')
  const last  = text.lastIndexOf('}')
  if (first === -1 || last === -1) throw new Error('No JSON en respuesta del modelo')
  return JSON.parse(text.substring(first, last + 1))
}

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function setupSummary(setup: ReportSetup): string {
  return `${setup.clientName} · ${setup.budgetMonthly.toLocaleString('es-ES')}€/mes`
}
