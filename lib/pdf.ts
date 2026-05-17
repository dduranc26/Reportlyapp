import { GeneratedReport } from './types'
import { fmtEur, fmtNum } from './utils'

export function buildPdfHtml(r: GeneratedReport): string {
  const { account: a, analysis: an, setup: s } = r

  const kpis = [
    { label: 'Inversión total',    value: fmtEur(a.totalSpend),              note: r.periodLabel },
    { label: 'ROAS global',        value: `${a.overallRoas}x`,               note: a.overallRoas >= 3 ? '✓ En benchmark' : '↗ Bajo benchmark (obj. 3x+)' },
    { label: 'CTR medio',          value: `${a.avgCtr}%`,                    note: a.avgCtr >= 1.2 ? '✓ En benchmark' : '↗ Bajo benchmark (obj. 1.2%+)' },
    { label: 'CPC medio',          value: fmtEur(a.avgCpc),                  note: 'Coste por clic' },
    { label: 'Conversiones',       value: fmtNum(a.totalConversions),         note: 'Período analizado' },
    { label: 'Alcance estimado',   value: fmtNum(a.totalImpressions / 3),    note: 'Personas únicas aprox.' },
  ]

  const campRows = a.campaigns.slice(0, 8).map((c, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#FAFAF8'}">
      <td style="padding:8px 12px;font-weight:500;color:#0A0A0A;font-size:10px;max-width:180px">${c.name}</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right">${fmtEur(c.spend)}</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right">${fmtNum(c.impressions)}</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right">${c.ctr}%</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right">${fmtEur(c.cpc)}</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right;font-weight:600;color:${c.roas >= 3 ? '#2D6A4F' : c.roas >= 1.5 ? '#9B4819' : '#8B1A1A'}">${c.roas}x</td>
      <td style="padding:8px 12px;font-size:10px;text-align:right">${fmtNum(c.conversions)}</td>
    </tr>
  `).join('')

  const recs = an.recommendations.map((rec, i) => `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:0.5px solid #DDD9D3">
      <div style="width:24px;height:24px;border-radius:50%;background:#0A0A0A;color:#F5F2ED;font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${i + 1}</div>
      <p style="font-size:11px;color:#3A3A3A;line-height:1.65;margin:0;padding-top:3px">${rec}</p>
    </div>
  `).join('')

  const alerts = an.alerts.length > 0
    ? an.alerts.map(a => `
        <div style="background:#FFF5F5;border:0.5px solid #E5B4B4;border-radius:6px;padding:10px 14px;margin-bottom:8px;font-size:11px;color:#8B1A1A">⚠ ${a}</div>
      `).join('')
    : `<div style="background:#F0FAF4;border:0.5px solid #A8D5B8;border-radius:6px;padding:10px 14px;font-size:11px;color:#2D6A4F">✓ No se detectan alertas críticas en este período</div>`

  const scoreCol = an.overallScore >= 80 ? '#2D6A4F' : an.overallScore >= 65 ? '#1A5276' : an.overallScore >= 50 ? '#9B4819' : '#8B1A1A'

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#0A0A0A;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

/* COVER */
.cover{width:210mm;min-height:297mm;background:#0A0A0A;color:#F5F2ED;padding:52px;display:flex;flex-direction:column;page-break-after:always}
.cover-agency{font-family:'Playfair Display',serif;font-size:18px;color:#C4A35A;margin-bottom:auto}
.cover-eyebrow{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,242,237,0.4);margin-bottom:18px}
.cover-title{font-family:'Playfair Display',serif;font-size:48px;line-height:1.1;color:#F5F2ED;margin-bottom:12px}
.cover-subtitle{font-size:13px;color:rgba(245,242,237,0.45);margin-bottom:52px}
.cover-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border-top:0.5px solid rgba(245,242,237,0.12);padding-top:24px}
.cover-stat-label{font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(245,242,237,0.3);margin-bottom:6px}
.cover-stat-value{font-family:'Playfair Display',serif;font-size:20px;color:#F5F2ED}
.cover-score{text-align:right}
.cover-score-num{font-family:'Playfair Display',serif;font-size:52px;color:${scoreCol};line-height:1}
.cover-score-label{font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(245,242,237,0.4);margin-top:4px}

/* PAGE */
.page{width:210mm;min-height:297mm;padding:40px 52px 60px;page-break-after:always;position:relative}
.page-header{display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:0.5px solid #DDD9D3;margin-bottom:28px}
.page-agency{font-size:11px;font-weight:500;color:#0A0A0A}
.page-client{font-size:10px;color:#9A9490}
.page-period{font-size:9px;color:#C4C0BA}
.page-footer{position:absolute;bottom:28px;left:52px;right:52px;display:flex;justify-content:space-between;align-items:center;border-top:0.5px solid #EAE6DF;padding-top:12px}
.footer-left{font-size:9px;color:#9A9490;font-weight:500}
.footer-right{font-size:8.5px;color:#C4C0BA}

/* SECTIONS */
.section-eyebrow{font-size:8.5px;letter-spacing:0.12em;text-transform:uppercase;color:#9A9490;margin-bottom:8px}
.section-title{font-family:'Playfair Display',serif;font-size:20px;color:#0A0A0A;margin-bottom:16px}
.text-block{font-size:11px;color:#3A3A3A;line-height:1.75;background:#FAFAF8;border-left:2px solid #0A0A0A;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:14px}

/* KPI GRID */
.kpi-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:24px}
.kpi{background:#FAFAF8;border:0.5px solid #DDD9D3;border-radius:8px;padding:14px 16px}
.kpi-label{font-size:8.5px;letter-spacing:0.08em;text-transform:uppercase;color:#9A9490;margin-bottom:6px}
.kpi-value{font-family:'Playfair Display',serif;font-size:22px;color:#0A0A0A;margin-bottom:3px}
.kpi-note{font-size:9px;color:#9A9490}

/* TABLE */
.table-wrap{border:0.5px solid #DDD9D3;border-radius:8px;overflow:hidden;margin-bottom:20px}
table{width:100%;border-collapse:collapse}
thead th{background:#0A0A0A;color:rgba(245,242,237,0.6);text-align:left;padding:9px 12px;font-size:8px;letter-spacing:0.08em;text-transform:uppercase;font-weight:500}
thead th:not(:first-child){text-align:right}

/* NEXT STEPS */
.next-block{background:#0A0A0A;border-radius:8px;padding:18px 20px;margin-top:14px}
.next-eyebrow{font-size:8.5px;letter-spacing:0.12em;text-transform:uppercase;color:#C4A35A;margin-bottom:8px}
.next-text{font-size:11px;color:rgba(245,242,237,0.75);line-height:1.7}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-agency">${s.agencyName}</div>
  <div>
    <p class="cover-eyebrow">Informe de rendimiento · Meta Ads</p>
    <h1 class="cover-title">Análisis<br>de campañas<br>${s.clientName}</h1>
    <p class="cover-subtitle">Generado el ${r.generatedAt}${r.isDemo ? ' · Datos de demostración' : ''}</p>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end">
    <div class="cover-grid">
      <div>
        <p class="cover-stat-label">Período</p>
        <p style="font-size:11px;color:rgba(245,242,237,0.7)">${r.periodLabel}</p>
      </div>
      <div>
        <p class="cover-stat-label">Inversión</p>
        <p class="cover-stat-value">${fmtEur(a.totalSpend)}</p>
      </div>
      <div>
        <p class="cover-stat-label">ROAS</p>
        <p class="cover-stat-value">${a.overallRoas}x</p>
      </div>
    </div>
    <div class="cover-score">
      <p class="cover-score-num">${an.overallScore}</p>
      <p class="cover-score-label">Health Score</p>
    </div>
  </div>
</div>

<!-- PAGE 2: KPIs + Análisis ejecutivo -->
<div class="page">
  <div class="page-header">
    <div><p class="page-agency">${s.agencyName}</p><p class="page-client">Informe para ${s.clientName}</p></div>
    <p class="page-period">${r.periodLabel}</p>
  </div>

  <p class="section-eyebrow">Métricas clave del período</p>
  <h2 class="section-title">Resumen ejecutivo</h2>

  <div class="kpi-grid">
    ${kpis.map(k => `
      <div class="kpi">
        <p class="kpi-label">${k.label}</p>
        <p class="kpi-value">${k.value}</p>
        <p class="kpi-note">${k.note}</p>
      </div>
    `).join('')}
  </div>

  <p class="section-eyebrow" style="margin-top:20px">Veredicto general</p>
  <div class="text-block">${an.executiveSummary}</div>

  <p class="section-eyebrow" style="margin-top:16px">Análisis de KPIs vs. benchmarks del sector</p>
  <div class="text-block">${an.kpiAnalysis}</div>

  <div class="page-footer">
    <p class="footer-left">${s.agencyName}</p>
    <p class="footer-right">Documento confidencial · Uso exclusivo del cliente</p>
  </div>
</div>

<!-- PAGE 3: Campañas + Alertas -->
<div class="page">
  <div class="page-header">
    <div><p class="page-agency">${s.agencyName}</p><p class="page-client">Informe para ${s.clientName}</p></div>
    <p class="page-period">${r.periodLabel}</p>
  </div>

  <p class="section-eyebrow">Rendimiento por campaña</p>
  <h2 class="section-title">Análisis de campañas</h2>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Campaña</th><th style="text-align:right">Inversión</th>
          <th style="text-align:right">Impresiones</th><th style="text-align:right">CTR</th>
          <th style="text-align:right">CPC</th><th style="text-align:right">ROAS</th>
          <th style="text-align:right">Conv.</th>
        </tr>
      </thead>
      <tbody>${campRows}</tbody>
    </table>
  </div>

  <div class="text-block">${an.campaignAnalysis}</div>

  <p class="section-eyebrow" style="margin-top:18px">Alertas y puntos de atención</p>
  <div>${alerts}</div>

  <div class="page-footer">
    <p class="footer-left">${s.agencyName}</p>
    <p class="footer-right">Documento confidencial · Uso exclusivo del cliente</p>
  </div>
</div>

<!-- PAGE 4: Recomendaciones + Próximos pasos -->
<div class="page">
  <div class="page-header">
    <div><p class="page-agency">${s.agencyName}</p><p class="page-client">Informe para ${s.clientName}</p></div>
    <p class="page-period">${r.periodLabel}</p>
  </div>

  <p class="section-eyebrow">Acciones recomendadas</p>
  <h2 class="section-title">Recomendaciones estratégicas</h2>

  <div style="margin-bottom:24px">${recs}</div>

  <div class="next-block">
    <p class="next-eyebrow">Próximos pasos — esta semana</p>
    <p class="next-text">${an.nextSteps}</p>
  </div>

  <div class="page-footer">
    <p class="footer-left">${s.agencyName}</p>
    <p class="footer-right">Documento confidencial · Uso exclusivo del cliente</p>
  </div>
</div>

</body>
</html>`
}
