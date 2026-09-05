import Link from 'next/link'
export default function CTA({label='รับสิทธิ์ทั้งหมด 390 บาท →'}:{label?:string}){
  return <Link className="btn" href="/checkout">{label}</Link>
}
