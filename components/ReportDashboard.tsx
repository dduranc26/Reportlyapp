'use client'

import { useState } from 'react'
import { Download, Share2, RotateCcw, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react'
import { GeneratedReport } from '@/lib/types'
import { fmtEur, fmtNum, scoreColor, cn } from '@/lib/utils'

interface Props {
  report:  GeneratedReport
  onReset: () => void
}

export default function ReportDashboard({ report, onReset }: Props) {
  const [loadingPdf,   setLoadingPdf]   = useState(false)
  const [shareUrl,     setShareUrl]     = useState('')
  const [copied,       setCopied]       = useState(false)

  const { setup: s, account: a, analysis: an } = report
  const sc = scoreColor(an.overallScore)

  async function downloadPdf() {
    setLoadingPdf(true)
    try {
      const res  = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      })
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `reportly-${s.clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoadingPdf(false)
    }
  }

  async function generateShareLink() {
    const url = `${window.location.origin}/dashboard/${report.id}`
    setShareUrl(url)
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="animate-fade-up space-y-0">

      {/* Sticky action bar */}
      <div className="sticky top-14 z-10 bg-cream/95 backdrop-blur-sm border-b border-border py-3 -mx-6 px-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">{s.clientName}</p>
          <p className="text-xs text-muted">{s.agencyName} · {report.periodLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="btn text-xs py-2 px-4">
            <RotateCcw size={12} /> Nuevo
          </button>
          <button onClick={generateShareLink} className="btn text-xs py-2 px-4">
            <Share2 size={12} />
            {copied ? 'Link copiado!' : 'Compartir link'}
          </button>
          <button onClick={downloadPdf} disabled={loadingPdf} className="btn btn-primary text-xs py-2 px-4">
            <Download size={12} />
            {loadingPdf ? 'Generando…' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      {/* Health score + summary */}
      <div className="border border-border bg-white p-8 mb-5">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0 text-center">
            <div
              className="w-24 h-24 border-2 flex flex-col items-center justify-center"
              style={{ borderColor: sc.color, background: sc.bg }}
            >
              <span className="font-display text-4xl leading-none" style={{ color: sc.color }}>
                {an.overallScore}
              </span>
              <span className="text-2xs tracking-widest mt-1" style={{ color: sc.color }}>
                / 100
              </span>
            </div>
            <p className="text-2xs tracking-wide mt-2" style={{ color: sc.color }}>{sc.label}</p>
          </div>
          <div className="flex-1">
            <p className="eyebrow mb-2">Veredicto ejecutivo</p>
            <p className="text-sm text-ink leading-relaxed">{an.executiveSummary}</p>
            {report.isDemo && (
              <p className="text-2xs text-muted mt-3 tracking-wide">
                DEMO · DATOS SIMULADOS CALIBRADOS AL SECTOR {s.sector.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-px bg-border mb-px">
        {[
          { label: 'Inversión total',   value: fmtEur(a.totalSpend),          sub: report.periodLabel },
          { label: 'ROAS global',       value: `${a.overallRoas}x`,           sub: a.overallRoas >= 3 ? '✓ En benchmark' : '↗ Bajo benchmark' },
          { label: 'CTR medio',         value: `${a.avgCtr}%`,                sub: a.avgCtr >= 1.2 ? '✓ En benchmark' : '↗ Bajo benchmark' },
          { label: 'CPC medio',         value: fmtEur(a.avgCpc),              sub: 'Coste por clic' },
          { label: 'Conversiones',      value: fmtNum(a.totalConversions),     sub: 'Total período' },
          { label: 'Impresiones',       value: fmtNum(a.totalImpressions),     sub: 'Total período' },
        ].map(k => (
          <div key={k.label} className="bg-white p-5">
            <p className="eyebrow mb-2">{k.label}</p>
            <p className="font-display text-3xl text-ink mb-1">{k.value}</p>
            <p className="text-xs text-muted">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Campaign table */}
      <div className="border border-border bg-white mb-5 mt-5">
        <div className="px-6 py-4 border-b border-border">
          <p className="eyebrow">Rendimiento por campaña</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Campaña', 'Inversión', 'Impresiones', 'CTR', 'CPC', 'ROAS', 'Conv.', 'Estado'].map(h => (
                  <th key={h} className={cn(
                    'py-3 px-4 text-left eyebrow font-medium',
                    h !== 'Campaña' && 'text-right'
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.campaigns.map((c, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-warm/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-ink max-w-[200px] truncate">{c.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-muted">{fmtEur(c.spend)}</td>
                  <td className="py-3 px-4 text-sm text-right text-muted">{fmtNum(c.impressions)}</td>
                  <td className="py-3 px-4 text-sm text-right text-muted">{c.ctr}%</td>
                  <td className="py-3 px-4 text-sm text-right text-muted">{fmtEur(c.cpc)}</td>
                  <td className={cn(
                    'py-3 px-4 text-sm text-right font-medium',
                    c.roas >= 3 ? 'text-ok' : c.roas >= 1.5 ? 'text-warn' : 'text-danger'
                  )}>{c.roas}x</td>
                  <td className="py-3 px-4 text-sm text-right text-muted">{fmtNum(c.conversions)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'text-2xs tracking-wide px-2 py-1',
                      c.status === 'activa'   ? 'bg-green-50 text-ok' :
                      c.status === 'limitada' ? 'bg-amber-50 text-warn' : 'bg-gray-50 text-muted'
                    )}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI + Campaign analysis */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Insight title="Análisis de KPIs" text={an.kpiAnalysis} />
        <Insight title="Análisis de campañas" text={an.campaignAnalysis} />
      </div>

      {/* Alerts */}
      {an.alerts.length > 0 && (
        <div className="border border-border bg-white p-6 mb-5">
          <p className="eyebrow mb-4">Alertas</p>
          <div className="space-y-2">
            {an.alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200">
                <AlertTriangle size={14} className="text-danger mt-0.5 flex-shrink-0" />
                <p className="text-sm text-danger">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="border border-border bg-white p-6 mb-5">
        <p className="eyebrow mb-5">Recomendaciones estratégicas</p>
        <div className="divide-y divide-border">
          {an.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <div className="w-6 h-6 bg-ink text-cream flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-2xs font-medium">{i + 1}</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-ink p-8 mb-5">
        <p className="eyebrow text-gold mb-3">Próximos pasos — esta semana</p>
        <p className="text-sm text-cream/75 leading-relaxed">{an.nextSteps}</p>
      </div>

      {/* Share link */}
      {shareUrl && (
        <div className="border border-border bg-white p-5 mb-5 flex items-center gap-4">
          <ExternalLink size={14} className="text-muted flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted mb-1">Link del dashboard para tu cliente</p>
            <p className="text-sm text-ink font-mono truncate">{shareUrl}</p>
          </div>
          <span className="text-2xs text-ok tracking-wide">{copied ? 'COPIADO' : ''}</span>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center gap-3">
        <button onClick={downloadPdf} disabled={loadingPdf} className="btn btn-primary w-full sm:w-auto">
          <Download size={14} />
          {loadingPdf ? 'Generando PDF…' : 'Descargar PDF con logo de agencia'}
        </button>
        <button onClick={generateShareLink} className="btn w-full sm:w-auto">
          <Share2 size={14} />
          Copiar link para el cliente
        </button>
        <button onClick={onReset} className="text-xs text-muted hover:text-ink transition-colors">
          Generar otro informe
        </button>
      </div>

    </div>
  )
}

function Insight({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-border bg-white p-6">
      <p className="eyebrow mb-3">{title}</p>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  )
}
