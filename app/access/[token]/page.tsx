import { supabaseRest } from '../../../lib/supabaseServer'

type Order = {
  status: string
  access_token: string
  order_number: string
}

function Resource({
  href,
  step,
  title,
  desc,
  buttonLabel = 'เปิดใช้งาน',
  note,
}: {
  href?: string
  step: string
  title: string
  desc: string
  buttonLabel?: string
  note?: string
}) {
  return (
    <section className="access-resource">
      <div className="access-step">{step}</div>
      <div className="access-resource-body">
        <h2>{title}</h2>
        <p>{desc}</p>
        {note ? <div className="access-note">{note}</div> : null}
        {href ? (
          <a className="btn access-btn" href={href} target="_blank" rel="noreferrer">
            {buttonLabel} →
          </a>
        ) : (
          <div className="access-pending">กำลังตั้งค่าลิงก์สำหรับสิทธิ์นี้</div>
        )}
      </div>
    </section>
  )
}

export default async function Access({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  let order: Order | null = null

  try {
    const found = await supabaseRest<Order[]>(
      `orders?select=status,access_token,order_number&access_token=eq.${encodeURIComponent(token)}&limit=1`
    )
    order = found.data?.[0] || null
  } catch (error) {
    console.error('Access lookup error:', error)
  }

  if (!order || order.status !== 'PAID') {
    return (
      <main className="section">
        <div className="container">
          <div className="checkout-card access-shell">
            <h1 className="h2">ไม่พบสิทธิ์เข้าใช้งาน</h1>
            <p className="muted">ลิงก์นี้ไม่ถูกต้อง หรือคำสั่งซื้อยังไม่ได้รับการยืนยันการชำระเงิน</p>
            <a className="btn" href="/">กลับหน้าหลัก</a>
          </div>
        </div>
      </main>
    )
  }

  const facebook = process.env.FACEBOOK_GROUP_URL
  const line = process.env.LINE_OPENCHAT_URL
  const checklist = process.env.FINANCIAL_CHECKLIST_URL
  const webapp = process.env.WEBAPP_URL
  const privateLine = process.env.PRIVATE_LINE_URL
  const ebook = process.env.EBOOK_URL
  const ebookPassword = process.env.EBOOK_PASSWORD
  const openchatCode = process.env.LINE_OPENCHAT_CODE

  return (
    <main className="section access-page">
      <div className="container">
        <div className="checkout-card access-shell">
          <div className="access-success">✓ ชำระเงินเรียบร้อย</div>
          <h1 className="h2">🎉 รับสิทธิ์ Passive Income Starter Set ได้เลย</h1>
          <p className="muted">
            เลขที่คำสั่งซื้อ <strong>{order.order_number}</strong><br />
            แนะนำให้บันทึกลิงก์หน้านี้ไว้ เพื่อกลับมาใช้สิทธิ์ภายหลัง
          </p>

          <div className="access-tip">
            <strong>เริ่มตรงนี้</strong>
            <span>แนะนำให้เข้ากลุ่มคอร์สก่อน แล้วดูเมนู “แนะนำ” และ “คู่มือ” เพื่อเริ่มเรียนตามลำดับ</span>
          </div>

          <div className="access-resources">
            <Resource
              href={facebook}
              step="STEP 1"
              title="คอร์ส Passive Income / กลุ่มปิด"
              desc="เข้าไปที่เมนู “แนะนำ” เพื่อดูวิธีใช้งานกลุ่ม และเมนู “คู่มือ” เพื่อเลือกเรียนตามหัวข้อ"
              buttonLabel="เข้ากลุ่มคอร์ส"
            />

            <Resource
              href={ebook}
              step="STEP 2"
              title="E-book “อาณาจักรหุ้นปันผล”"
              desc="ดาวน์โหลด E-book ฉบับเต็มสำหรับสมาชิก"
              buttonLabel="ดาวน์โหลด E-book"
              note={ebookPassword ? `รหัสเปิด E-book: ${ebookPassword}` : undefined}
            />

            <Resource
              href={line}
              step="STEP 3"
              title="LINE Community"
              desc="เข้ากลุ่มเรียนรู้ พูดคุย และติดตามข้อมูลสำหรับสมาชิก"
              buttonLabel="เข้ากลุ่ม LINE"
              note={openchatCode ? `รหัสเข้ากลุ่ม: ${openchatCode}` : undefined}
            />

            <Resource
              href={checklist}
              step="STEP 4"
              title="Stock Fundamental Checklist Pro"
              desc="ไฟล์ช่วยฝึกดูงบและประเมินพื้นฐานหุ้นอย่างเป็นระบบ"
              buttonLabel="เปิด Checklist"
            />

            <Resource
              href={webapp}
              step="STEP 5"
              title="Web App วิเคราะห์หุ้น"
              desc="ใช้งานเครื่องมือสรุปหุ้น แนวรับ–จุดเข้าซื้อ ต้นทุนเฉลี่ย ดอกเบี้ยทบต้น และข้อมูลพื้นฐาน"
              buttonLabel="เปิด Web App"
            />

            <Resource
              href={privateLine}
              step="STEP 6"
              title="Private Support"
              desc="ช่องทางสอบถามเรื่องการใช้งานและการเรียนรู้ผ่าน LINE ส่วนตัว"
              buttonLabel="ติดต่อ Support"
            />
          </div>

          <div className="access-warning">
            <strong>สำหรับสมาชิกเท่านั้น</strong>
            <span>กรุณาไม่นำลิงก์หรือรหัสในหน้านี้ไปเผยแพร่ต่อ</span>
          </div>

          <p className="disclaimer" style={{ marginTop: 24 }}>
            เนื้อหาและเครื่องมือจัดทำเพื่อการศึกษา ไม่ใช่คำแนะนำซื้อขายหลักทรัพย์ ผลลัพธ์จากการลงทุนแตกต่างกันในแต่ละบุคคล
          </p>
        </div>
      </div>
    </main>
  )
}
