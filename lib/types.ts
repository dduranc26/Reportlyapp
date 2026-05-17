// ─────────────────────────────────────────────────────────
// Reportly — Type definitions
// ─────────────────────────────────────────────────────────

export type Sector =
  | 'ecommerce'
  | 'clinica'
  | 'inmobiliaria'
  | 'restaurante'
  | 'moda'
  | 'tecnologia'
  | 'educacion'
  | 'otro'

export type Objetivo =
  | 'ventas'
  | 'leads'
  | 'trafico'
  | 'branding'

export type Periodo =
  | '7'
  | '14'
  | '30'

export interface ReportSetup {
  agencyName:   string
  clientName:   string
  sector:       Sector
  objetivo:     Objetivo
  budgetMonthly: number
  periodo:      Periodo
  agencyLogo?:  string // base64
}

export interface CampaignMetric {
  name:        string
  spend:       number
  impressions: number
  clicks:      number
  ctr:         number
  cpc:         number
  conversions: number
  roas:        number
  status:      'activa' | 'pausada' | 'limitada'
}

export interface AccountSummary {
  totalSpend:       number
  totalImpressions: number
  totalClicks:      number
  totalConversions: number
  avgCtr:           number
  avgCpm:           number
  avgCpc:           number
  overallRoas:      number
  campaigns:        CampaignMetric[]
}

export interface ReportAnalysis {
  executiveSummary:  string
  kpiAnalysis:       string
  campaignAnalysis:  string
  recommendations:   string[]
  alerts:            string[]
  nextSteps:         string
  overallScore:      number  // 0-100 health score
  scoreLabel:        string
}

export interface GeneratedReport {
  id:           string
  setup:        ReportSetup
  account:      AccountSummary
  analysis:     ReportAnalysis
  generatedAt:  string
  periodLabel:  string
  isDemo:       boolean
}

export interface GenerateResponse {
  success: boolean
  data?:   GeneratedReport
  error?:  string
}
