import { NextRequest, NextResponse } from 'next/server'
import { getReport } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const report = getReport(params.id)
  if (!report) {
    return NextResponse.json({ success: false, error: 'Informe no encontrado o expirado.' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: report })
}
