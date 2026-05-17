import { ReportSetup, AccountSummary, Sector, Objetivo } from './types'

const SECTOR_LABELS: Record<Sector, string> = {
  ecommerce:   'E-commerce / Tienda online',
  clinica:     'Clínica / Centro de salud',
  inmobiliaria:'Inmobiliaria / Promotora',
  restaurante: 'Restaurante / Hostelería',
  moda:        'Moda / Lifestyle',
  tecnologia:  'Tecnología / SaaS',
  educacion:   'Educación / Formación',
  otro:        'Otro sector',
}

const OBJETIVO_LABELS: Record<Objetivo, string> = {
  ventas:   'Maximizar ventas y ROAS',
  leads:    'Generación de leads cualificados',
  trafico:  'Tráfico web y awareness',
  branding: 'Branding y reconocimiento de marca',
}

const BENCHMARKS_TEXT: Record<Sector, string> = {
  ecommerce:    'ROAS saludable e-commerce España: 3-5x | CTR bueno Meta: >1.5% | CPM razonable: 5-12€ | Tasa conversión: 2-3.5%',
  clinica:      'ROAS saludable clínicas: 4-8x | CTR bueno Meta: >1.0% | CPL razonable: 15-45€ | Tasa conversión leads: 2.5-5%',
  inmobiliaria: 'ROAS saludable inmobiliaria: 5-12x | CTR bueno Meta: >0.8% | CPL razonable: 30-80€ | Tasa conversión: 1-2.5%',
  restaurante:  'ROAS saludable hostelería: 2.5-4.5x | CTR bueno Meta: >1.8% | CPC razonable: 0.30-0.80€ | Conversión: 3-7%',
  moda:         'ROAS saludable moda: 3.5-7x | CTR bueno Meta: >2% | CPM razonable: 4-10€ | Tasa conversión: 2-4%',
  tecnologia:   'ROAS saludable SaaS: 3-6x | CTR bueno Meta: >0.8% | CPL razonable: 25-80€ | Tasa conversión: 1.5-3.5%',
  educacion:    'ROAS saludable educación: 3.5-7x | CTR bueno Meta: >1% | CPL razonable: 12-35€ | Tasa conversión: 2-4.5%',
  otro:         'ROAS saludable general: 2.5-5x | CTR bueno Meta: >1.2% | CPM razonable: 5-15€ | Tasa conversión: 1.5-3.5%',
}

export function buildAnalysisPrompt(
  setup:   ReportSetup,
  account: AccountSummary,
  periodLabel: string
): string {
  const topCampaigns = account.campaigns.slice(0, 6)

  const campaignDetails = topCampaigns.map(c =>
    `• ${c.name}: ${c.spend}€ invertidos | ${c.impressions.toLocaleString('es-ES')} impresiones | CTR ${c.ctr}% | CPC ${c.cpc}€ | ROAS ${c.roas}x | ${c.conversions} conversiones | Estado: ${c.status}`
  ).join('\n')

  return `Eres el mejor analista de performance marketing de España, con 15 años de experiencia gestionando cuentas de Meta Ads para agencias. Generas informes que los dueños de negocios entienden y valoran.

CONTEXTO DEL CLIENTE:
• Cliente: ${setup.clientName}
• Sector: ${SECTOR_LABELS[setup.sector]}
• Objetivo principal: ${OBJETIVO_LABELS[setup.objetivo]}
• Presupuesto mensual: ${setup.budgetMonthly.toLocaleString('es-ES')}€
• Período analizado: ${periodLabel}

MÉTRICAS GLOBALES DE LA CUENTA:
• Inversión total: ${account.totalSpend.toLocaleString('es-ES')}€
• Impresiones totales: ${account.totalImpressions.toLocaleString('es-ES')}
• Clics totales: ${account.totalClicks.toLocaleString('es-ES')}
• Conversiones: ${account.totalConversions}
• CTR medio: ${account.avgCtr}%
• CPM medio: ${account.avgCpm}€
• CPC medio: ${account.avgCpc}€
• ROAS global: ${account.overallRoas}x

DETALLE POR CAMPAÑA:
${campaignDetails}

BENCHMARKS DEL SECTOR:
${BENCHMARKS_TEXT[setup.sector]}

INSTRUCCIONES:
1. Analiza el rendimiento comparando con los benchmarks del sector. Sé específico y honesto.
2. El cliente es el dueño o marketing manager del negocio — entiende el negocio pero no es técnico en publicidad.
3. Usa lenguaje claro, directo y profesional. Sin jerga técnica innecesaria.
4. El health score debe ser realista: 100 = rendimiento excepcional, 70-85 = bueno, 50-70 = mejorable, <50 = preocupante.
5. Las recomendaciones deben ser MUY concretas y accionables — qué hacer exactamente, no "optimizar campañas".

Responde ÚNICAMENTE con JSON válido. Sin markdown, sin backticks:
{
  "executiveSummary": "3-4 líneas resumiendo el veredicto: qué funcionó, qué no, y el estado general de la cuenta",
  "kpiAnalysis": "Análisis de los KPIs más importantes comparado con benchmarks del sector. 3-4 líneas. Sé específico: si el ROAS es 3.2x y el benchmark es 3-5x, dilo exactamente así",
  "campaignAnalysis": "Análisis de las campañas: cuáles están rindiendo bien y por qué, cuáles están quemando presupuesto. 3-4 líneas muy concretas",
  "recommendations": [
    "Recomendación 1 extremadamente concreta: qué hacer exactamente, en qué campaña, y por qué ahora",
    "Recomendación 2 extremadamente concreta",
    "Recomendación 3 extremadamente concreta"
  ],
  "alerts": [
    "Alerta urgente si hay algo crítico — o array vacío si todo está bajo control"
  ],
  "nextSteps": "Qué hacer esta semana, en orden de prioridad. 2-3 acciones con orden explícito: primero, segundo, tercero",
  "overallScore": 74,
  "scoreLabel": "Rendimiento sólido con margen de mejora"
}`
}
