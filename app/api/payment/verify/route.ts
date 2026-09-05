import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseRest } from '../../../../lib/supabaseServer'
import { sendAccessEmail } from '../../../../lib/resendEmail'

export const runtime = 'nodejs'

const EASYSLIP_URL = 'https://api.easyslip.com/v2/verify/bank'
const EXPECTED_AMOUNT = 390
const MAX_FILE_SIZE = 4 * 1024 * 1024
const TIMEOUT_MS = 15000
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

type Order = { id:string; order_number:string; status:string; amount:number|string; access_token:string|null; customer_id:string }
type Payment = { id:string; order_id:string; easyslip_trans_ref:string }
type Customer = { id:string; name:string; email:string }

type EasySlipResult = {
  success?: boolean
  message?: string
  data?: {
    remark?: string
    isDuplicate?: boolean
    matchedAccount?: unknown | null
    amountInOrder?: number
    amountInSlip?: number
    isAmountMatched?: boolean
    rawSlip?: {
      transRef?: string
      date?: string
      amount?: { amount?: number }
      sender?: { account?: { name?: { th?: string; en?: string } }; bank?: { short?: string } }
      receiver?: { account?: { name?: { th?: string; en?: string } }; bank?: { short?: string } }
    }
  }
  error?: { code?: string; message?: string }
}

function friendlyError(code?: string, fallback?: string) {
  const map: Record<string, string> = {
    INVALID_API_KEY: 'EasySlip API Key ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า',
    BRANCH_INACTIVE: 'EasySlip Branch ยังไม่พร้อมใช้งาน',
    SERVICE_BANNED: 'บริการ EasySlip ของบัญชีนี้ถูกระงับชั่วคราว',
    USER_BANNED: 'บัญชี EasySlip ถูกระงับชั่วคราว',
    IP_NOT_ALLOWED: 'EasySlip ไม่อนุญาต IP ที่กำลังเรียกใช้งาน',
    QUOTA_EXCEEDED: 'โควตาการตรวจสอบสลิปของ EasySlip หมดแล้ว',
    VALIDATION_ERROR: 'ข้อมูลสลิปไม่ผ่านเงื่อนไขการตรวจสอบ',
    SLIP_NOT_FOUND: 'ไม่พบข้อมูลสลิป หรือ QR บนสลิปอ่านไม่ได้',
    API_SERVER_ERROR: 'ระบบธนาคารหรือ EasySlip ขัดข้องชั่วคราว',
  }
  return (code && map[code]) || fallback || 'ไม่สามารถตรวจสอบสลิปได้ กรุณาลองใหม่อีกครั้ง'
}

async function getOrder(orderNumber:string) {
  const found = await supabaseRest<Order[]>(`orders?select=id,order_number,status,amount,access_token,customer_id&order_number=eq.${encodeURIComponent(orderNumber)}&limit=1`)
  return found.data?.[0] || null
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.EASYSLIP_API_KEY
    if (!apiKey) return NextResponse.json({ ok:false, message:'ยังไม่พบ EASYSLIP_API_KEY ใน .env.local' }, { status:500 })

    const incoming = await req.formData()
    const image = incoming.get('image') || incoming.get('slip')
    const orderId = String(incoming.get('orderId') || '').trim()

    if (!orderId) return NextResponse.json({ ok:false, message:'ไม่พบเลขที่คำสั่งซื้อ' }, { status:400 })
    const order = await getOrder(orderId)
    if (!order) return NextResponse.json({ ok:false, message:'ไม่พบคำสั่งซื้อนี้ในระบบ' }, { status:404 })

    if (order.status === 'PAID' && order.access_token) {
      return NextResponse.json({ ok:true, message:'คำสั่งซื้อนี้ชำระเงินแล้ว', accessToken:order.access_token })
    }

    if (!(image instanceof File)) return NextResponse.json({ ok:false, message:'กรุณาเลือกภาพสลิปก่อนตรวจสอบ' }, { status:400 })
    if (image.size > MAX_FILE_SIZE) return NextResponse.json({ ok:false, message:'ไฟล์สลิปต้องมีขนาดไม่เกิน 4 MB' }, { status:400 })
    if (!ALLOWED_TYPES.has(image.type)) return NextResponse.json({ ok:false, message:'รองรับไฟล์ JPG, PNG, GIF และ WebP เท่านั้น' }, { status:400 })

    const body = new FormData()
    body.append('image', image, image.name || 'slip.jpg')
    body.append('remark', `Order ${orderId}`)
    body.append('matchAccount', 'true')
    body.append('matchAmount', String(EXPECTED_AMOUNT))
    body.append('checkDuplicate', 'true')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let response:Response
    try {
      response = await fetch(EASYSLIP_URL, {
        method:'POST',
        headers:{ Authorization:`Bearer ${apiKey}` },
        body,
        cache:'no-store',
        signal:controller.signal,
      })
    } catch(error:any) {
      if (error?.name === 'AbortError') {
        return NextResponse.json({ ok:false, message:'EasySlip ใช้เวลาตรวจสอบนานเกินไป กรุณาลองใหม่อีกครั้ง' }, { status:504 })
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }

    const result = (await response.json().catch(() => ({}))) as EasySlipResult
    if (!response.ok || result.success !== true || !result.data) {
      const code=result.error?.code
      return NextResponse.json({ ok:false, code, message:friendlyError(code,result.error?.message || result.message) }, { status:response.status>=400?response.status:400 })
    }

    const data=result.data
    const slipAmount=data.amountInSlip ?? data.rawSlip?.amount?.amount
    const transRef=data.rawSlip?.transRef?.trim()

    if (data.isDuplicate === true) return NextResponse.json({ ok:false, code:'DUPLICATE_SLIP', message:'สลิปนี้เคยถูกใช้ตรวจสอบแล้ว กรุณาใช้สลิปของรายการนี้เท่านั้น' }, { status:409 })
    if (data.isAmountMatched === false || (typeof slipAmount==='number' && Math.abs(slipAmount-EXPECTED_AMOUNT)>0.001)) return NextResponse.json({ ok:false, code:'AMOUNT_MISMATCH', message:`ยอดในสลิปไม่ตรง กรุณาชำระ ${EXPECTED_AMOUNT}.00 บาท` }, { status:400 })
    if (data.matchedAccount == null) return NextResponse.json({ ok:false, code:'ACCOUNT_MISMATCH', message:'บัญชีผู้รับในสลิปไม่ตรงกับบัญชีรับเงินที่ลงทะเบียนไว้ใน EasySlip' }, { status:400 })
    if (!transRef) return NextResponse.json({ ok:false, message:'ไม่พบเลขอ้างอิงธุรกรรมจากสลิป กรุณาลองใช้ภาพสลิปที่ชัดเจน' }, { status:400 })

    // Extra duplicate protection in our own database.
    const existingPayment = await supabaseRest<Payment[]>(`payments?select=id,order_id,easyslip_trans_ref&easyslip_trans_ref=eq.${encodeURIComponent(transRef)}&limit=1`)
    if (existingPayment.data?.length) {
      return NextResponse.json({ ok:false, code:'DUPLICATE_SLIP_DB', message:'สลิปนี้ถูกใช้กับคำสั่งซื้ออื่นแล้ว' }, { status:409 })
    }

    await supabaseRest<Payment[]>('payments?select=id,order_id,easyslip_trans_ref', {
      method:'POST',
      headers:{ Prefer:'return=representation' },
      body:JSON.stringify({
        order_id:order.id,
        provider:'EASYSLIP',
        amount:slipAmount ?? EXPECTED_AMOUNT,
        easyslip_trans_ref:transRef,
        slip_date:data.rawSlip?.date || null,
        sender_name:data.rawSlip?.sender?.account?.name?.th || data.rawSlip?.sender?.account?.name?.en || null,
        receiver_name:data.rawSlip?.receiver?.account?.name?.th || data.rawSlip?.receiver?.account?.name?.en || null,
        account_matched:true,
        amount_matched:true,
        status:'VERIFIED',
      }),
    })

    const accessToken = crypto.randomUUID()
    const paid = await supabaseRest<Order[]>(`orders?id=eq.${encodeURIComponent(order.id)}&select=id,order_number,status,amount,access_token,customer_id`, {
      method:'PATCH',
      headers:{ Prefer:'return=representation' },
      body:JSON.stringify({ status:'PAID', paid_at:new Date().toISOString(), access_token:accessToken }),
    })
    const updated = paid.data?.[0]
    if (!updated?.access_token) throw new Error('ORDER_PAID_UPDATE_FAILED')

    // Email is deliberately non-blocking for payment success.
    // If Resend is temporarily unavailable, the customer still gets access on-screen.
    let email = { sent:false as boolean, skipped:false as boolean, to:undefined as string|undefined, error:undefined as string|undefined }
    try {
      const customerResult = await supabaseRest<Customer[]>(`customers?select=id,name,email&id=eq.${encodeURIComponent(updated.customer_id || order.customer_id)}&limit=1`)
      const customer = customerResult.data?.[0]
      if (customer?.email) {
        const result = await sendAccessEmail({
          customerName:customer.name || 'ลูกค้า',
          customerEmail:customer.email,
          orderNumber:updated.order_number,
          accessToken:updated.access_token,
        })
        email = { sent:result.sent, skipped:!!result.skipped, to:result.to, error:result.error }
      } else {
        email = { sent:false, skipped:true, to:undefined, error:'CUSTOMER_EMAIL_NOT_FOUND' }
      }
    } catch(emailError:any) {
      console.error('Access email error:', emailError)
      email = { sent:false, skipped:false, to:undefined, error:'EMAIL_SEND_FAILED' }
    }

    return NextResponse.json({
      ok:true,
      message:email.sent
        ? 'ตรวจสอบสลิปสำเร็จ เปิดสิทธิ์สมาชิกแล้ว และส่งอีเมลรับสิทธิ์เรียบร้อย'
        : 'ตรวจสอบสลิปสำเร็จ และเปิดสิทธิ์สมาชิกแล้ว',
      accessToken:updated.access_token,
      emailSent:email.sent,
      emailTo:email.to,
      payment:{ amount:slipAmount ?? EXPECTED_AMOUNT, transRef, date:data.rawSlip?.date || null },
    })
  } catch(error:any) {
    console.error('Payment verify error:', error?.details || error)
    if (error?.message === 'SUPABASE_ENV_MISSING') return NextResponse.json({ ok:false, message:'ยังตั้งค่า Supabase ใน .env.local ไม่ครบ' }, { status:500 })
    return NextResponse.json({ ok:false, message:'เกิดข้อผิดพลาดระหว่างบันทึกการชำระเงิน กรุณาลองใหม่อีกครั้ง' }, { status:500 })
  }
}
