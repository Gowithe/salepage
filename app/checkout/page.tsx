'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Checkout(){
  const router=useRouter()
  const searchParams=useSearchParams()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setError('')
    const fd=new FormData(e.currentTarget)
    try{
      const res=await fetch('/api/orders',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:fd.get('name'),
          email:fd.get('email'),
          utm_source:searchParams.get('utm_source'),
          utm_medium:searchParams.get('utm_medium'),
          utm_campaign:searchParams.get('utm_campaign'),
          utm_content:searchParams.get('utm_content'),
          utm_term:searchParams.get('utm_term'),
          fbclid:searchParams.get('fbclid'),
        })
      })
      const data=await res.json()
      if(res.ok && data.orderId){
        router.push(`/payment/${data.orderId}`)
        return
      }
      setError(data.message || 'สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่')
    }catch{
      setError('เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    }finally{
      setLoading(false)
    }
  }

  return <><div className="topbar"><div className="container brand">Checkout</div></div><main className="section"><div className="container checkout-wrap"><form className="checkout-card" onSubmit={submit}><h1 className="h2">ข้อมูลสำหรับรับสิทธิ์</h1><p className="muted">กรอกข้อมูลให้ถูกต้อง โดยเฉพาะอีเมล เพราะระบบจะใช้ส่งลิงก์เข้าใช้งาน</p><div className="field"><label>ชื่อ *</label><input name="name" required/></div><div className="field"><label>อีเมล *</label><input type="email" name="email" required/></div>{error && <div className="notice payment-status payment-error">{error}</div>}<button className="btn" disabled={loading}>{loading?'กำลังสร้างคำสั่งซื้อ...':'ดำเนินการชำระเงิน 390 บาท'}</button></form><aside className="checkout-card sticky"><h3>Passive Income Starter Set</h3>{['E-book','คอร์ส Passive Income','คอร์สภาษีหุ้น','Financial Checklist','Web App','LINE Community','Private Support'].map(x=><div className="summary-row" key={x}><span>{x}</span><span>✓</span></div>)}<div className="summary-row"><strong>รวม</strong><strong>390 บาท</strong></div><p className="disclaimer">ชำระครั้งเดียว • สิทธิ์หลักตามเงื่อนไขตลอดชีพ</p></aside></div></main></>
}
