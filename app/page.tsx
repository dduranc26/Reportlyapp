'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import SetupForm       from '@/components/SetupForm'
import LoadingScreen   from '@/components/LoadingScreen'
import ReportDashboard from '@/components/ReportDashboard'
import { ReportSetup, GeneratedReport } from '@/lib/types'

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false })

type State = 'idle' | 'loading' | 'result' | 'error'

function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 22,20 2,20" fill="#0A0A0A" />
      <polygon points="12,7 18,18 6,18" fill="#F5F2ED" />
      <polygon points="12,11 15,17 9,17" fill="#0A0A0A" />
    </svg>
  )
}

export default function Home() {
  const [state,  setState]  = useState<State>('idle')
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(setup: ReportSetup) {
    setState('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setReport(json.data)
      setState('result')
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Error inesperado')
      setState('error')
    }
  }

  function reset() { setState('idle'); setReport(null); setErrMsg('') }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* 3D background — always present */}
      <Scene3D />

      {/* Frosted overlay so content stays readable */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(245,242,237,0.55)', backdropFilter: 'blur(0.5px)' }} />

      {/* Nav */}
      <header className="relative z-20 border-b sticky top-0"
        style={{ borderColor: 'rgba(196,163,90,0.2)', background: 'rgba(245,242,237,0.82)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span className="font-display text-sm tracking-wide text-[#0A0A0A]">Reportly</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase', color:'#9A9490' }}>Demo</span>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#2D6A4F', animation:'pulse 2s ease-in-out infinite' }} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {(state === 'idle' || state === 'error') && (
          <>
            {state === 'error' && (
              <div className="mb-6 p-4 animate-fade-up"
                style={{ background:'rgba(254,242,242,0.9)', border:'0.5px solid #FECACA', backdropFilter:'blur(8px)' }}>
                <p className="text-sm" style={{ color:'#8B1A1A' }}>{errMsg}</p>
              </div>
            )}
            <SetupForm onSubmit={handleSubmit} loading={false} />
          </>
        )}
        {state === 'loading' && <LoadingScreen />}
        {state === 'result' && report && (
          <ReportDashboard report={report} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t py-5"
        style={{ borderColor:'rgba(196,163,90,0.15)', background:'rgba(245,242,237,0.75)', backdropFilter:'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={16} />
            <p style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#9A9490' }}>Reportly</p>
          </div>
          <p style={{ fontSize:'10px', color:'rgba(154,148,144,0.6)', letterSpacing:'0.08em' }}>No se almacenan datos reales</p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.5;transform:scale(0.9)} 50%{opacity:1;transform:scale(1.1)} }
      `}</style>
    </div>
  )
}
