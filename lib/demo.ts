import { ReportSetup, AccountSummary, CampaignMetric, Sector } from './types'

// ─────────────────────────────────────────────────────────
// Benchmarks reales por sector (fuente: industry reports 2024)
// ─────────────────────────────────────────────────────────
const SECTOR_BENCHMARKS: Record<Sector, {
  avgCtr:   [number, number]  // [min, max]
  avgCpc:   [number, number]
  avgRoas:  [number, number]
  convRate: [number, number]
  campaigns: { name: string; type: string }[]
}> = {
  ecommerce: {
    avgCtr:   [1.2, 2.8],
    avgCpc:   [0.45, 1.20],
    avgRoas:  [2.8, 5.5],
    convRate: [1.8, 3.5],
    campaigns: [
      { name: 'Advantage+ Shopping', type: 'shopping' },
      { name: 'Retargeting — Visitantes 30d', type: 'retargeting' },
      { name: 'Prospecting — Intereses', type: 'prospecting' },
      { name: 'Dynamic Product Ads', type: 'dpa' },
    ],
  },
  clinica: {
    avgCtr:   [0.8, 1.9],
    avgCpc:   [1.20, 3.50],
    avgRoas:  [3.5, 8.0],
    convRate: [2.5, 5.0],
    campaigns: [
      { name: 'Lead Gen — Tratamientos', type: 'lead_gen' },
      { name: 'Retargeting — Web 14d', type: 'retargeting' },
      { name: 'Lookalike — Pacientes', type: 'lookalike' },
    ],
  },
  inmobiliaria: {
    avgCtr:   [0.6, 1.4],
    avgCpc:   [2.50, 6.00],
    avgRoas:  [4.0, 12.0],
    convRate: [1.0, 2.5],
    campaigns: [
      { name: 'Lead Gen — Compradores', type: 'lead_gen' },
      { name: 'Lead Gen — Vendedores', type: 'lead_gen' },
      { name: 'Retargeting — Interesados', type: 'retargeting' },
    ],
  },
  restaurante: {
    avgCtr:   [1.5, 3.2],
    avgCpc:   [0.30, 0.90],
    avgRoas:  [2.0, 4.5],
    convRate: [3.0, 7.0],
    campaigns: [
      { name: 'Awareness — Zona Local', type: 'awareness' },
      { name: 'Promociones Semanales', type: 'traffic' },
      { name: 'Reservas Online', type: 'conversion' },
    ],
  },
  moda: {
    avgCtr:   [1.8, 3.5],
    avgCpc:   [0.35, 0.95],
    avgRoas:  [3.2, 6.8],
    convRate: [2.0, 4.0],
    campaigns: [
      { name: 'Nueva Colección — Prospecting', type: 'prospecting' },
      { name: 'Retargeting — Carritos Abandonados', type: 'retargeting' },
      { name: 'Advantage+ — Ventas', type: 'shopping' },
      { name: 'Lookalike — Compradores VIP', type: 'lookalike' },
    ],
  },
  tecnologia: {
    avgCtr:   [0.7, 1.6],
    avgCpc:   [2.00, 5.50],
    avgRoas:  [2.5, 6.0],
    convRate: [1.5, 3.5],
    campaigns: [
      { name: 'Lead Gen — Demos', type: 'lead_gen' },
      { name: 'Retargeting — Trial Users', type: 'retargeting' },
      { name: 'Prospecting — Decision Makers', type: 'prospecting' },
    ],
  },
  educacion: {
    avgCtr:   [0.9, 2.1],
    avgCpc:   [0.80, 2.20],
    avgRoas:  [3.0, 7.0],
    convRate: [2.0, 4.5],
    campaigns: [
      { name: 'Lead Gen — Inscripciones', type: 'lead_gen' },
      { name: 'Retargeting — Interesados', type: 'retargeting' },
      { name: 'Lookalike — Alumnos', type: 'lookalike' },
    ],
  },
  otro: {
    avgCtr:   [1.0, 2.2],
    avgCpc:   [0.60, 1.80],
    avgRoas:  [2.5, 5.0],
    convRate: [1.5, 3.5],
    campaigns: [
      { name: 'Campaña Principal', type: 'main' },
      { name: 'Retargeting', type: 'retargeting' },
      { name: 'Prospecting', type: 'prospecting' },
    ],
  },
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function rand(min: number, max: number, decimals = 2): number {
  const r = Math.random() * (max - min) + min
  return Math.round(r * 10 ** decimals) / 10 ** decimals
}

function fmt(n: number, dec = 2): number {
  return Math.round(n * 10 ** dec) / 10 ** dec
}

// ─────────────────────────────────────────────────────────
// Main generator
// ─────────────────────────────────────────────────────────
export function generateDemoData(setup: ReportSetup): AccountSummary {
  const bench = SECTOR_BENCHMARKS[setup.sector]
  const budget = setup.budgetMonthly
  const days   = parseInt(setup.periodo)
  const periodBudget = (budget / 30) * days

  // Distribute budget across campaigns with realistic variance
  const campDefs = bench.campaigns
  const weights  = campDefs.map(() => rand(0.5, 1.5, 2))
  const totalW   = weights.reduce((a, b) => a + b, 0)

  const campaigns: CampaignMetric[] = campDefs.map((c, i) => {
    const share  = weights[i] / totalW
    const spend  = fmt(periodBudget * share)

    const ctr  = rand(...bench.avgCtr)
    const cpc  = rand(...bench.avgCpc)
    const cpm  = fmt(cpc * ctr * 10)
    const impressions = Math.round((spend / cpm) * 1000)
    const clicks      = Math.round(impressions * (ctr / 100))
    const convRate    = rand(...bench.convRate) / 100
    const conversions = fmt(clicks * convRate)
    const revenue     = fmt(conversions * rand(15, 120))
    const roas        = spend > 0 ? fmt(revenue / spend) : 0

    // Add slight noise for realism
    const noise = rand(0.88, 1.12, 2)

    return {
      name:        c.name,
      spend:       fmt(spend * noise),
      impressions: Math.round(impressions * noise),
      clicks:      Math.round(clicks * noise),
      ctr:         fmt(ctr * rand(0.9, 1.1)),
      cpc:         fmt(cpc * rand(0.9, 1.1)),
      conversions: fmt(conversions * noise),
      roas:        fmt(roas * rand(0.85, 1.15)),
      status:      i === 0 ? 'activa' : rand(0, 1) > 0.15 ? 'activa' : 'limitada',
    }
  })

  // Aggregate totals
  const totalSpend       = fmt(campaigns.reduce((s, c) => s + c.spend, 0))
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const totalClicks      = campaigns.reduce((s, c) => s + c.clicks, 0)
  const totalConversions = fmt(campaigns.reduce((s, c) => s + c.conversions, 0))

  const avgCtr = totalImpressions > 0
    ? fmt((totalClicks / totalImpressions) * 100)
    : 0
  const avgCpm = totalImpressions > 0
    ? fmt((totalSpend / totalImpressions) * 1000)
    : 0
  const avgCpc = totalClicks > 0
    ? fmt(totalSpend / totalClicks)
    : 0

  const revenue = fmt(campaigns.reduce((s, c) => s + (c.roas * c.spend), 0))
  const overallRoas = totalSpend > 0 ? fmt(revenue / totalSpend) : 0

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCtr,
    avgCpm,
    avgCpc,
    overallRoas,
    campaigns,
  }
}
