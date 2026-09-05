import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Passive Income Starter Set | 390 บาท',
  description: 'ชุดเรียนรู้หุ้นปันผลสำหรับมือใหม่ พร้อมคอร์ส ภาษี เครื่องมือวิเคราะห์หุ้น Community และ Support'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="th"><body>{children}</body></html>
}
