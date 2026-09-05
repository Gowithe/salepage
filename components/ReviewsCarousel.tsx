'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const reviews = Array.from({ length: 10 }, (_, i) => `/reviews/review-${String(i + 1).padStart(2, '0')}.jpg`)

export default function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = (next: number) => {
    const safe = (next + reviews.length) % reviews.length
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
      setIndex(Math.max(0, Math.min(reviews.length - 1, Math.round(track.scrollLeft / width))))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="reviews-carousel" aria-label="รีวิวจากผู้อ่านและสมาชิก">
      <div className="review-stage">
        <button className="review-arrow review-arrow-left" onClick={() => goTo(index - 1)} aria-label="รีวิวก่อนหน้า"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div className="review-track" ref={trackRef}>
          {reviews.map((src, i) => (
            <div className="review-slide" key={src}>
              <div className="review-image-wrap">
                <Image src={src} width={1240} height={1754} alt={`รีวิวจากผู้อ่านและสมาชิก ${i + 1}`} sizes="(max-width: 780px) 92vw, 720px" />
              </div>
            </div>
          ))}
        </div>
        <button className="review-arrow review-arrow-right" onClick={() => goTo(index + 1)} aria-label="รีวิวถัดไป"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
      <div className="review-controls">
        <span className="review-count">{index + 1} / {reviews.length}</span>
        <div className="review-dots" aria-label="เลือกรูปรีวิว">
          {reviews.map((_, i) => <button key={i} className={`review-dot ${i === index ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`ไปรีวิวที่ ${i + 1}`} />)}
        </div>
      </div>
      <p className="review-swipe-hint">บนมือถือปัดซ้าย–ขวาเพื่ออ่านทีละรูปได้</p>
    </div>
  )
}
