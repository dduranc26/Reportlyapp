import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { v4 as uuidv4 } from 'uuid'
import { ReportSetup, GeneratedReport, GenerateResponse } from '@/lib/types'
import { generateDemoData } from '@/lib/demo'
import { buildAnalysisPrompt } from '@/lib/prompt'
import { extractJson, periodLabel } from '@/lib/utils'
import { saveReport } from '@/lib/store'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const maxDuration = 60

export async function POST(req: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const setup: ReportSetup = await req.json()

    // Validate
    if (!setup.agencyName?.trim()) return NextResponse.json({ success: false, error: 'Falta el nombre de la agencia.' }, { status: 400 })
    if (!setup.clientName?.trim()) return NextResponse.json({ success: false, error: 'Falta el nombre del cliente.' }, { status: 400 })
    if (!setup.budgetMonthly || setup.budgetMonthly < 100) return NextResponse.json({ success: false, error: 'El presupuesto mínimo es 100€.' }, { status: 400 })

    const label = periodLabel(setup.periodo)

    // 1. Generate demo data calibrated to sector + budget
    const account = generateDemoData(setup)

    // 2. Analyze with Claude
    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-5',
      max_tokens: 2048,
      messages:   [{ role: 'user', content: buildAnalysisPrompt(setup, account, label) }],
    })

    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const analysis = extractJson(rawText) as GeneratedReport['analysis']

    if (!analysis.executiveSummary || !Array.isArray(analysis.recommendations)) {
      throw new Error('Formato de respuesta inesperado del modelo')
    }

    // Clamp score
    analysis.overallScore = Math.min(100, Math.max(0, Math.round(analysis.overallScore || 70)))

    // 3. Build report
    const id = uuidv4()
    const report: GeneratedReport = {
      id,
      setup,
      account,
      analysis,
      generatedAt: new Date().toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      periodLabel: label,
      isDemo: true,
    }

    // 4. Store for share link
    saveReport(id, report)

    return NextResponse.json({ success: true, data: report })

  } catch (err: unknown) {
    console.error('[/api/generate]', err)
    const msg = err instanceof Error ? err.message : 'Error inesperado'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
