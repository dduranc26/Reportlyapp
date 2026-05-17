'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Calibrando métricas al sector…',
  'Generando datos de campañas…',
  'Comparando con benchmarks del mercado…',
  'Analizando rendimiento con IA…',
  'Redactando recomendaciones…',
  'Preparando informe final…',
]

export default function LoadingScreen() {
  const [step, setStep]       = useState(0)
  const [progress, setProgress] = useState(2)

  useEffect(() => {
    const si = setInterval(() => setStep(i => Math.min(i + 1, STEPS.length - 1)), 3000)
    const pi = setInterval(() => setProgress(p => p >= 90 ? p : p + (p < 40 ? 4 : p < 70 ? 2 : 0.8)), 200)
    return () => { clearInterval(si); clearInterval(pi) }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">

      {/* Animated mark */}
      <div className="mb-12 relative">
        <div className="w-16 h-16 border border-border bg-white flex items-center justify-content-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mx-auto my-auto" style={{margin:'auto'}}>
            <rect x="2" y="2"  width="11" height="11" fill="#0A0A0A" className="animate-pulse" />
            <rect x="15" y="2" width="11" height="11" fill="#DDD9D3" />
            <rect x="2" y="15" width="11" height="11" fill="#DDD9D3" />
            <rect x="15" y="15" width="11" height="11" fill="#0A0A0A" style={{animationDelay:'0.6s'}} className="animate-pulse" />
          </svg>
        </div>
      </div>

      <p className="font-display text-2xl text-ink mb-3">Generando tu informe</p>
      <p className="text-sm text-muted mb-12 text-center">{STEPS[step]}</p>

      {/* Progress bar */}
      <div className="w-72">
        <div className="h-px bg-border overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-2xs text-muted">Analizando</p>
          <p className="text-2xs text-muted">{Math.round(progress)}%</p>
        </div>
      </div>

    </div>
  )
}
