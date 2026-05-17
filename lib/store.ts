import { GeneratedReport } from './types'

// ─────────────────────────────────────────────────────────
// Simple in-memory store para compartir reportes por link
// En producción → reemplazar por Supabase o Redis
// ─────────────────────────────────────────────────────────
const store = new Map<string, GeneratedReport>()

export function saveReport(id: string, report: GeneratedReport): void {
  store.set(id, report)
  // Auto-expire after 24h (cleanup)
  setTimeout(() => store.delete(id), 24 * 60 * 60 * 1000)
}

export function getReport(id: string): GeneratedReport | undefined {
  return store.get(id)
}
