'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const slides = [
  { src: '/offer-slides/01-ebook.png', title: 'E-book อาณาจักรหุ้นปันผล' },
  { src: '/offer-slides/02-tax-course.png', title: 'คอร์สภาษีหุ้นอเมริกา' },
  { src: '/offer-slides/03-private-course.png', title: 'คอร์สเรียนกลุ่มปิด' },
  { src: '/offer-slides/04-line-community.png', title: 'LINE กลุ่มสมาชิก' },
  { src: '/offer-slides/05-financial-file.png', title: 'ไฟล์ประเมินงบการเงินหุ้น' },
  { src: '/offer-slides/06-private-support.png', title: 'ปรึกษาส่วนตัวได้' },
  { src: '/offer-slides/07-stock-webapp.png', title: 'สิทธิ์ใช้งานเว็บแอปวิเคราะห์หุ้นฟรี' },
]

export default function OfferCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = (next: number) => {
    const safe = (next + slides.length) % slides.length
    const track = trackRef.current
    if (!track) return
    const slide = track.children[safe] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    setIndex(safe)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const width = track.clientWidth
      if (!width) return
      setIndex(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width))))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="offer-carousel" aria-label="รายละเอียด 7 สิทธิ์ที่ได้รับ">
      <div className="offer-stage">
        <button className="offer-arrow offer-arrow-left" onClick={() => goTo(index - 1)} aria-label="ภาพก่อนหน้า"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="offer-track" ref={trackRef}>
          {slides.map((slide, i) => (
            <div className="offer-slide" key={slide.src}>
              <div className="offer-image-wrap">
                <Image
                  src={slide.src}
                  width={1536}
                  height={1024}
                  alt={`${i + 1} จาก ${slides.length}: ${slide.title}`}
                  sizes="(max-width: 780px) 94vw, 980px"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="offer-arrow offer-arrow-right" onClick={() => goTo(index + 1)} aria-label="ภาพถัดไป"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="offer-controls">
        <strong className="offer-label">{slides[index].title}</strong>
        <span className="offer-count">{index + 1} / {slides.length}</span>
        <div className="offer-dots" aria-label="เลือกภาพ">
          {slides.map((slide, i) => (
            <button key={slide.src} className={`offer-dot ${i === index ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`ไปยัง ${slide.title}`} />
          ))}
        </div>
      </div>
      <p className="offer-swipe-hint">บนมือถือปัดซ้าย–ขวาเพื่อดูทีละภาพได้</p>
    </div>
  )
}
