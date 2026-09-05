const RESEND_URL = 'https://api.resend.com/emails'

type SendAccessEmailInput = {
  customerName: string
  customerEmail: string
  orderNumber: string
  accessToken: string
}

type SendAccessEmailResult = {
  sent: boolean
  skipped?: boolean
  to?: string
  id?: string
  error?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function sendAccessEmail(input: SendAccessEmailInput): Promise<SendAccessEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '')
  const testTo = process.env.RESEND_TEST_TO?.trim()

  if (!apiKey || !from) {
    console.warn('Resend skipped: RESEND_API_KEY or EMAIL_FROM is missing')
    return { sent: false, skipped: true, error: 'RESEND_ENV_MISSING' }
  }

  const to = testTo || input.customerEmail
  const accessUrl = `${siteUrl}/access/${encodeURIComponent(input.accessToken)}`
  const safeName = escapeHtml(input.customerName || 'ลูกค้า')
  const safeOrder = escapeHtml(input.orderNumber)

  const html = `
  <div style="margin:0;padding:32px 16px;background:#f7f7f2;font-family:Arial,'Noto Sans Thai',sans-serif;color:#17352d;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e5e8e2;">
      <div style="font-size:13px;font-weight:700;letter-spacing:.04em;color:#f28c45;margin-bottom:10px;">PASSIVE INCOME STARTER SET</div>
      <h1 style="font-size:26px;line-height:1.35;margin:0 0 14px;color:#174c3c;">ชำระเงินสำเร็จ 🎉</h1>
      <p style="font-size:16px;line-height:1.8;margin:0 0 12px;">สวัสดีครับคุณ ${safeName}</p>
      <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">ระบบยืนยันการชำระเงินเรียบร้อยแล้ว คุณสามารถกดปุ่มด้านล่างเพื่อรับ E-book คอร์ส กลุ่มสมาชิก เครื่องมือ และสิทธิ์ทั้งหมดได้ทันที</p>
      <div style="background:#f3f7f4;border-radius:12px;padding:14px 16px;margin:0 0 22px;font-size:14px;line-height:1.7;">
        เลขที่คำสั่งซื้อ: <strong>${safeOrder}</strong><br>
        ยอดชำระ: <strong>390 บาท</strong>
      </div>
      <a href="${accessUrl}" style="display:block;text-align:center;background:#174c3c;color:#ffffff;text-decoration:none;font-size:17px;font-weight:700;padding:15px 20px;border-radius:12px;">รับสิทธิ์และเริ่มเรียน</a>
      <p style="font-size:13px;line-height:1.7;color:#66736e;margin:20px 0 0;">เก็บอีเมลฉบับนี้ไว้ เพื่อกลับเข้าสู่หน้ารับสิทธิ์ของคุณได้ภายหลัง</p>
      ${testTo ? `<p style="font-size:12px;line-height:1.6;color:#9a5b2f;margin:14px 0 0;">โหมดทดสอบ: อีเมลนี้ถูกส่งไปยัง RESEND_TEST_TO แทนที่อยู่อีเมลลูกค้าจริง (${escapeHtml(input.customerEmail)})</p>` : ''}
    </div>
  </div>`

  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `paid-access/${input.orderNumber}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `ชำระเงินสำเร็จ — รับสิทธิ์ Passive Income Starter Set (${input.orderNumber})`,
      html,
    }),
    cache: 'no-store',
  })

  const data = await response.json().catch(() => ({} as any))
  if (!response.ok) {
    console.error('Resend error:', data)
    return { sent: false, to, error: data?.message || data?.name || `HTTP_${response.status}` }
  }

  return { sent: true, to, id: data?.id }
}
