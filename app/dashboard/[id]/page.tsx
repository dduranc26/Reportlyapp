'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReportDashboard from '@/components/ReportDashboard'
import { GeneratedReport } from '@/lib/types'

export default function SharedDashboard() {
  const params = useParams()
  const id     = params?.id as string

  const [report,  setReport]  = useState<GeneratedReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/share/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setReport(json.data)
        else setError(json.error || 'Informe no encontrado')
      })
      .catch(() => setError('Error al cargar el informe'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="relative z-10 min-h-screen flex flex-col">

      <header className="border-b border-border bg-cream/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-ink grid grid-cols-2 gap-[2px] p-[3px]">
              <div className="bg-cream" />
              <div className="bg-cream/40" />
              <div className="bg-cream/40" />
              <div className="bg-cream" />
            </div>
            <span className="font-display text-sm tracking-wide text-ink">Reportly</span>
          </div>
          {report && (
            <span className="text-2xs tracking-wide text-muted">{report.setup.agencyName}</span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-8 h-8 border border-border mx-auto mb-4 animate-pulse bg-white" />
              <p className="text-sm text-muted">Cargando informe…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-danger mb-2">{error}</p>
            <p className="text-xs text-muted">Los informes compartidos expiran después de 24 horas.</p>
          </div>
        )}

        {report && (
          <ReportDashboard report={report} onReset={() => window.location.href = '/'} />
        )}
      </main>

      <footer className="border-t border-border py-5">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <p className="text-2xs tracking-wide text-muted">REPORTLY · REPORTING CON IA</p>
          <p className="text-2xs tracking-wide text-muted">GENERADO CON INTELIGENCIA ARTIFICIAL</p>
        </div>
      </footer>

    </div>
  )
}
