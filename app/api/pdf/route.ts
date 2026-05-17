import { NextRequest, NextResponse } from 'next/server'
import { buildPdfHtml } from '@/lib/pdf'
import { GeneratedReport } from '@/lib/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const report: GeneratedReport = await req.json()

    const puppeteer = await import('puppeteer')
    const browser   = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    await page.setContent(buildPdfHtml(report), { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format:          'A4',
      printBackground: true,
      margin:          { top: '0', right: '0', bottom: '0', left: '0' },
    })

    await browser.close()

    const filename = `reportly-${report.setup.clientName.toLowerCase().replace(/\s+/g, '-')}-${report.setup.periodo}d.pdf`

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err: unknown) {
    console.error('[/api/pdf]', err)
    return NextResponse.json({ success: false, error: 'Error generando PDF' }, { status: 500 })
  }
}
