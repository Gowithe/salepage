'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

type VerifyResponse = {
  ok?: boolean
  message?: string
  accessToken?: string

  purchaseEvent?: {
    value: number
    currency: string
    contentName: string
    orderId: string
    eventId: string
  } | null

  payment?: {
    amount?: number
    transRef?: string | null
    date?: string | null
  }
}

export default function Payment({
  params,
}: {
  params: Promise<{
    orderId: string
  }>
}) {
  const { orderId } = use(params)

  const router = useRouter()

  const [file, setFile] =
    useState<File | null>(null)

  const [status, setStatus] =
    useState('')

  const [
    statusType,
    setStatusType,
  ] = useState<
    | 'idle'
    | 'loading'
    | 'success'
    | 'error'
  >('idle')

  async function verify(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!file) {
      setStatusType('error')

      setStatus(
        'กรุณาเลือกภาพสลิปก่อนตรวจสอบ'
      )

      return
    }

    if (
      file.size >
      4 * 1024 * 1024
    ) {
      setStatusType('error')

      setStatus(
        'ไฟล์สลิปต้องมีขนาดไม่เกิน 4 MB'
      )

      return
    }

    setStatusType('loading')

    setStatus(
      'กำลังตรวจสอบสลิปและบันทึกการชำระเงิน...'
    )

    try {
      const fd =
        new FormData()

      fd.append(
        'image',
        file
      )

      fd.append(
        'orderId',
        orderId
      )

      const res =
        await fetch(
          '/api/payment/verify',
          {
            method: 'POST',
            body: fd,
          }
        )

      const data =
        (await res.json()) as VerifyResponse

      if (
        res.ok &&
        data.ok
      ) {
        /*
         * ยิง Purchase เฉพาะเมื่อ API บอกว่า
         * เป็นการชำระเงินใหม่ที่เพิ่ง Verify สำเร็จ
         */
        if (
          data.purchaseEvent &&
          typeof window !==
            'undefined' &&
          window.fbq
        ) {
          window.fbq(
            'track',
            'Purchase',
            {
              value:
                data.purchaseEvent
                  .value,

              currency:
                data.purchaseEvent
                  .currency,

              content_name:
                data.purchaseEvent
                  .contentName,

              content_type:
                'product',

              order_id:
                data.purchaseEvent
                  .orderId,
            },
            {
              eventID:
                data.purchaseEvent
                  .eventId,
            }
          )
        }

        setStatusType(
          'success'
        )

        setStatus(
          data.message ||
            'ชำระเงินสำเร็จ'
        )

        if (
          data.accessToken
        ) {
          setTimeout(
            () =>
              router.push(
                `/access/${data.accessToken}`
              ),
            900
          )
        }
      } else {
        setStatusType(
          'error'
        )

        setStatus(
          data.message ||
            'ตรวจสอบสลิปไม่ผ่าน กรุณาตรวจสอบแล้วลองใหม่'
        )
      }
    } catch {
      setStatusType(
        'error'
      )

      setStatus(
        'เชื่อมต่อระบบตรวจสอบสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      )
    }
  }

  const statusClass =
    statusType === 'success'
      ? 'notice payment-status payment-success'
      : statusType === 'error'
      ? 'notice payment-status payment-error'
      : 'notice payment-status'

  return (
    <>
      <div className="topbar">
        <div className="container brand">
          ชำระเงิน
        </div>
      </div>

      <main className="section payment-section">
        <div className="container">
          <div className="payment-card">
            <div className="payment-step">
              ขั้นตอนสุดท้าย
            </div>

            <h1 className="h2">
              ชำระเงิน 390 บาท
            </h1>

            <p className="muted payment-intro">
              สแกน QR
              ด้วยแอปธนาคารเพื่อชำระ{' '}
              <strong>
                390 บาท
              </strong>{' '}
              จากนั้นอัปโหลดสลิปด้านล่าง
            </p>

            <div className="payment-amount">
              <span>
                ยอดที่ต้องชำระ
              </span>

              <strong>
                390 บาท
              </strong>
            </div>

            <div className="qr-wrap">
              <img
                src="/payment-qr.png"
                alt="QR สำหรับชำระเงิน"
                className="payment-qr"
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'center',
                marginTop:
                  '14px',
              }}
            >
              <a
                href="/payment-qr.png"
                download="payment-qr-390.png"
                className="btn"
                style={{
                  textDecoration:
                    'none',

                  textAlign:
                    'center',

                  width:
                    '100%',

                  maxWidth:
                    '320px',
                }}
              >
                📥 บันทึก QR
                เพื่อชำระเงิน
              </a>
            </div>

            <p
              className="muted"
              style={{
                textAlign:
                  'center',

                fontSize:
                  '14px',

                marginTop:
                  '10px',
              }}
            >
              หากใช้มือถือเครื่องเดียวกัน
              ให้บันทึก QR
              แล้วเปิดแอปธนาคารเพื่อเลือกสแกนจากรูปภาพ
            </p>

            <p
              className="muted"
              style={{
                textAlign:
                  'center',

                fontSize:
                  '13px',

                marginTop:
                  '4px',
              }}
            >
              หากกดแล้วรูปเปิดขึ้นมาแทนการดาวน์โหลด
              ให้แตะค้างที่รูปแล้วเลือก
              “บันทึกรูปภาพ”
            </p>

            <p className="payment-hint">
              QR นี้กำหนดยอด{' '}
              <strong>
                390.00 บาท
              </strong>{' '}
              ไว้แล้ว •
              กรุณาตรวจสอบชื่อผู้รับและยอดก่อนยืนยันการโอน
            </p>

            <div className="order-ref">
              เลขที่คำสั่งซื้อ{' '}
              <strong>
                {orderId}
              </strong>
            </div>

            <form
              onSubmit={verify}
              className="slip-form"
            >
              <label className="upload-box">
                <span className="upload-title">
                  อัปโหลดสลิปการโอนเงิน
                </span>

                <span className="muted">
                  รองรับ JPG, PNG,
                  GIF, WebP •
                  ไม่เกิน 4 MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(
                    e
                  ) => {
                    setFile(
                      e.target
                        .files?.[0] ||
                        null
                    )

                    setStatus(
                      ''
                    )

                    setStatusType(
                      'idle'
                    )
                  }}
                />

                <span className="file-name">
                  {file
                    ? `เลือกแล้ว: ${file.name}`
                    : 'แตะเพื่อเลือกภาพสลิป'}
                </span>
              </label>

              <button
                className="btn"
                type="submit"
                disabled={
                  statusType ===
                  'loading'
                }
              >
                {statusType ===
                'loading'
                  ? 'กำลังตรวจสอบ...'
                  : 'ตรวจสอบการชำระเงิน →'}
              </button>
            </form>

            {status && (
              <div
                className={
                  statusClass
                }
              >
                {status}
              </div>
            )}

            {statusType ===
              'success' && (
              <div className="payment-next">
                <strong>
                  ✓
                  ชำระเงินสำเร็จ
                </strong>

                <br />

                <span className="muted">
                  กำลังพาคุณไปยังหน้ารับสิทธิ์...
                </span>
              </div>
            )}

            <div className="payment-safe">
              <strong>
                ก่อนกดโอน
              </strong>

              <br />

              ตรวจสอบชื่อผู้รับและยอดเงินในแอปธนาคารของคุณทุกครั้ง
            </div>
          </div>
        </div>
      </main>
    </>
  )
}