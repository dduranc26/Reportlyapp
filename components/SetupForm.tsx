@'
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { ReportSetup, Sector, Objetivo, Periodo } from '@/lib/types'

interface Props {
  onSubmit: (setup: ReportSetup) => Promise<void>
  loading:  boolean
}

const SECTORS: { value: Sector; label: string; icon: string }[] = [
  { value: 'ecommerce',    label: 'E-commerce / Tienda online',  icon: '🛍' },
  { value: 'clinica',      label: 'Clínica / Centro de salud',   icon: '🏥' },
  { value: 'inmobiliaria', label: 'Inmobiliaria / Promotora',    icon: '🏠' },
  { value: 'restaurante',  label: 'Restaurante / Hostelería',    icon: '🍽' },
  { value: 'moda',         label: 'Moda / Lifestyle',            icon: '👗' },
  { value: 'tecnologia',   label: 'Tecnología / SaaS',           icon: '💻' },
  { value: 'educacion',    label: 'Educación / Formación',       icon: '📚' },
  { value: 'otro',         label: 'Otro sector',                  icon: '✦' },
]

const OBJETIVOS: { value: Objetivo; label: string }[] = [
  { value: 'ventas',   label: 'Maximizar ventas y ROAS' },
  { value: 'leads',    label: 'Generación de leads cualificados' },
  { value: 'trafico',  label: 'Tráfico web y awareness' },
  { value: 'branding', label: 'Branding y reconocimiento de marca' },
]

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: '7',  label: 'Últimos 7 días' },
  { value: '14', label: 'Últimos 14 días' },
  { value: '30', label: 'Últimos 30 días' },
]

export default function SetupForm({ onSubmit, loading }: Props) {
  const [agencyName, setAgencyName] = useState('')
  const [clientName, setClientName] = useState('')
  const [sector,     setSector]     = useState<Sector>('ecommerce')
  const [objetivo,   setObjetivo]   = useState<Objetivo>('ventas')
  const [budget,     setBudget]     = useState('')
  const [periodo,    setPeriodo]    = useState<Periodo>('30')
  const [error,      setError]      = useState('')
  const [focused,    setFocused]    = useState('')

  async function handleSubmit() {
    setError('')
    if (!agencyName.trim()) { setError('Introduce el nombre de tu agencia.'); return }
    if (!clientName.trim()) { setError('Introduce el nombre del cliente.'); return }
    if (!budget || parseInt(budget) < 100) { setError('El presupuesto mínimo es 100€/mes.'); return }
    await onSubmit({ agencyName: agencyName.trim(), clientName: clientName.trim(), sector, objetivo, budgetMonthly: parseInt(budget), periodo })
  }

  const inputStyle = (name: string) => ({
    width: '100%',
    background: focused === name ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    border: focused === name ? '1px solid #0A0A0A' : '1px solid #DDD9D3',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#0A0A0A',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: focused === name ? '0 0 0 3px rgba(196,163,90,0.12)' : 'none',
  })

  const selectStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #DDD9D3',
    padding: '12px 40px 12px 16px',
    fontSize: '14px',
    color: '#0A0A0A',
    outline: 'none',
    appearance: 'none' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <motion.div initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>

      <motion.div className="mb-12"
        variants={{ hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { duration:0.6 } } }}>
        <motion.div
          initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6"
          style={{ background:'rgba(196,163,90,0.12)', border:'0.5px solid rgba(196,163,90,0.35)' }}>
          <Sparkles size={10} style={{ color:'#C4A35A' }} />
          <span style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#9B4819', fontWeight:500 }}>
            Powered by IA · Demo gratuita
          </span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { duration:0.6 } } }}
          style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,6vw,3.8rem)', lineHeight:1.05, color:'#0A0A0A', marginBottom:'24px' }}>
          Tu cliente merece<br />
          <span className="relative inline-block">
            un informe mejor.
            <motion.svg
              initial={{ pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:1 }}
              transition={{ duration:1.2, delay:0.6 }}
              className="absolute -bottom-2 left-0 w-full" height="6"
              viewBox="0 0 400 6" fill="none" preserveAspectRatio="none">
              <motion.path d="M0 4 Q100 0 200 4 Q300 8 400 4"
                stroke="#C4A35A" strokeWidth="1.5" fill="none"
                initial={{ pathLength:0 }} animate={{ pathLength:1 }}
                transition={{ duration:1.2, delay:0.6 }} />
            </motion.svg>
          </span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { duration:0.6 } } }}
          style={{ fontSize:'15px', color:'#9A9490', lineHeight:1.7, maxWidth:'480px', marginBottom:'24px' }}>
          Introduce los datos del cliente. La IA genera un informe profesional
          calibrado al sector — PDF descargable o link compartible en 30 segundos.
        </motion.p>

        <motion.div className="flex items-center gap-8"
          variants={{ hidden: { opacity:0 }, show: { opacity:1, transition: { duration:0.6 } } }}>
          {[
            { label:'30 segundos', color:'#2D6A4F' },
            { label:'PDF con tu logo', color:'#C4A35A' },
            { label:'Link para cliente', color:'#0A0A0A' },
          ].map((t,i) => (
            <motion.div key={t.label} className="flex items-center gap-2"
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.4 + i * 0.1 }}>
              <motion.div animate={{ scale:[1,1.3,1] }}
                transition={{ duration:2, delay: i*0.4, repeat:Infinity, repeatDelay:3 }}
                style={{ width:'6px', height:'6px', borderRadius:'50%', background:t.color }} />
              <span style={{ fontSize:'12px', color:'#9A9490' }}>{t.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-3 mb-8"
        variants={{ hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { duration:0.6 } } }}
        style={{ gap:'1px', background:'rgba(196,163,90,0.2)' }}>
        {[
          { num:'6-10h', label:'ahorradas por cliente/mes' },
          { num:'30s',   label:'para generar el informe' },
          { num:'100%',  label:'calibrado al sector' },
        ].map((s,i) => (
          <motion.div key={s.num} className="text-center px-5 py-4"
            style={{ background:'rgba(255,255,255,0.55)', backdropFilter:'blur(8px)' }}
            whileHover={{ background:'rgba(255,255,255,0.85)', y:-2 }}>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'26px', color:'#0A0A0A', marginBottom:'2px' }}>{s.num}</p>
            <p style={{ fontSize:'10px', color:'#9A9490', letterSpacing:'0.04em' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { duration:0.6 } } }}
        style={{
          background:'rgba(255,255,255,0.68)', backdropFilter:'blur(20px)',
          border:'0.5px solid rgba(196,163,90,0.25)',
          boxShadow:'0 4px 32px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9)',
          padding:'32px',
        }}>

        <div style={{ marginBottom:'28px' }}>
          <p style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#9A9490', marginBottom:'16px' }}>
            Agencia y cliente
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id:'agency', label:'Nombre de tu agencia *', val:agencyName, set:setAgencyName, ph:'Ej: Marketing Pro Agency' },
              { id:'client', label:'Nombre del cliente *',   val:clientName, set:setClientName, ph:'Ej: Moda Otoño SL' },
            ].map(f => (
              <div key={f.id}>
                <label style={{ fontSize:'12px', color:'#9A9490', display:'block', marginBottom:'6px' }}>{f.label}</label>
                <motion.input type="text" value={f.val}
                  onChange={e => f.set(e.target.value)}
                  onFocus={() => setFocused(f.id)} onBlur={() => setFocused('')}
                  placeholder={f.ph} style={inputStyle(f.id)} whileFocus={{ scale:1.005 }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:'28px' }}>
          <p style={{ fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#9A9490', marginBottom:'16px' }}>
            Contexto de las campañas
          </p>
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom:'16px' }}>
            <div>
              <label style={{ fontSize:'12px', color:'#9A9490', display:'block', marginBottom:'6px' }}>Sector del cliente *</label>
              <div className="relative">
                <select value={sector} onChange={e=>setSector(e.target.value as Sector)} style={selectStyle}>
                  {SECTORS.map(s=><option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#9A9490', pointerEvents:'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize:'12px', color:'#9A9490', display:'block', marginBottom:'6px' }}>Objetivo principal *</label>
              <div className="relative">
                <select value={objetivo} onChange={e=>setObjetivo(e.target.value as Objetivo)} style={selectStyle}>
                  {OBJETIVOS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#9A9490', pointerEvents:'none' }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ fontSize:'12px', color:'#9A9490', display:'block', marginBottom:'6px' }}>Presupuesto mensual (€) *</label>
              <motion.input type="number" value={budget}
                onChange={e=>setBudget(e.target.value)}
                onFocus={()=>setFocused('budget')} onBlur={()=>setFocused('')}
                placeholder="Ej: 2000" min={100}
                style={inputStyle('budget')} whileFocus={{ scale:1.005 }} />
            </div>
            <div>
              <label style={{ fontSize:'12px', color:'#9A9490', display:'block', marginBottom:'6px' }}>Período del informe *</label>
              <div className="relative">
                <select value={periodo} onChange={e=>setPeriodo(e.target.value as Periodo)} style={selectStyle}>
                  {PERIODOS.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#9A9490', pointerEvents:'none' }} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            style={{ padding:'14px 16px', background:'rgba(254,242,242,0.9)', border:'0.5px solid #FECACA', marginBottom:'20px', fontSize:'13px', color:'#8B1A1A' }}>
            {error}
          </motion.div>
        )}

        <motion.button onClick={handleSubmit} disabled={loading}
          style={{
            width:'100%', padding:'16px', fontSize:'14px', letterSpacing:'0.08em',
            background:'#0A0A0A', color:'#F5F2ED', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            position:'relative', overflow:'hidden',
          }}
          whileHover={{ background:'#1A1A1A', scale:1.005 }}
          whileTap={{ scale:0.995 }}>
          <motion.div
            style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(196,163,90,0.15),transparent)' }}
            animate={{ x:['-100%','200%'] }}
            transition={{ duration:2.5, repeat:Infinity, ease:'linear', repeatDelay:1 }} />
          <span style={{ position:'relative', zIndex:1 }}>
            {loading ? 'Generando informe…' : 'Generar informe ahora'}
          </span>
          {!loading && (
            <motion.div style={{ position:'relative', zIndex:1 }}
              animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
              <ArrowRight size={15} />
            </motion.div>
          )}
        </motion.button>

        <p style={{ textAlign:'center', fontSize:'10px', color:'rgba(154,148,144,0.55)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:'16px' }}>
          Demo · Datos simulados · No se almacena información real
        </p>
      </motion.div>
    </motion.div>
  )
}
'@ | Set-Content -Path "components\SetupForm.tsx" -Encoding UTF8