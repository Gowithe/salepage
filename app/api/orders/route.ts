import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseRest } from '../../../lib/supabaseServer'

export const runtime = 'nodejs'

type Customer = { id: string; name: string; email: string }
type Order = { id: string; order_number: string; status: string }

function makeOrderNumber() {
  return `PI-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim().toLowerCase()

    if (!name || !email) {
      return NextResponse.json({ ok: false, message: 'กรุณากรอกชื่อและอีเมลให้ครบ' }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 400 })
    }

    // Find existing customer by normalized email.
    const qEmail = encodeURIComponent(email)
    const existing = await supabaseRest<Customer[]>(`customers?select=id,name,email&email=eq.${qEmail}&limit=1`)
    let customer = existing.data?.[0]

    if (!customer) {
      const created = await supabaseRest<Customer[]>('customers?select=id,name,email', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ name, email }),
      })
      customer = created.data?.[0]
    } else if (customer.name !== name) {
      // Keep the latest name supplied by the customer.
      await supabaseRest<Customer[]>(`customers?id=eq.${encodeURIComponent(customer.id)}&select=id,name,email`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ name }),
      })
    }

    if (!customer?.id) throw new Error('CUSTOMER_CREATE_FAILED')

    const orderNumber = makeOrderNumber()
    const createdOrder = await supabaseRest<Order[]>('orders?select=id,order_number,status', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        order_number: orderNumber,
        customer_id: customer.id,
        product_code: 'PASSIVE_INCOME_STARTER_SET',
        amount: 390,
        currency: 'THB',
        status: 'PENDING',
        utm_source: body?.utm_source || null,
        utm_medium: body?.utm_medium || null,
        utm_campaign: body?.utm_campaign || null,
        utm_content: body?.utm_content || null,
        utm_term: body?.utm_term || null,
        fbclid: body?.fbclid || null,
      }),
    })

    const order = createdOrder.data?.[0]
    if (!order?.order_number) throw new Error('ORDER_CREATE_FAILED')

    return NextResponse.json({ ok: true, orderId: order.order_number })
  } catch (error: any) {
    console.error('Create order error:', error?.details || error)
    if (error?.message === 'SUPABASE_ENV_MISSING') {
      return NextResponse.json({ ok: false, message: 'ยังตั้งค่า Supabase ใน .env.local ไม่ครบ' }, { status: 500 })
    }
    return NextResponse.json({ ok: false, message: 'สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
