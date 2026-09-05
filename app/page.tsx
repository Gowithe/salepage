import CTA from '../components/CTA'
import ReviewsCarousel from '../components/ReviewsCarousel'
import OfferCarousel from '../components/OfferCarousel'

export default function Home(){
  return <>
    <div className="topbar"><div className="container brand">Passive Income Starter Set</div></div>
    <main>
      <section className="hero"><div className="container hero-single">
        <div>
          <span className="eyebrow">สำหรับผู้เริ่มต้นที่สนใจหุ้นสหรัฐฯ</span>
          <h1 className="h1">อยากเริ่มลงทุนหุ้นอเมริกา แต่ไม่รู้ว่าจะเริ่มจากตรงไหน?</h1>
          <p className="lead">เริ่มจาก 0 ได้ในชุดเดียว — E-book + 2 คอร์ส + Web App + Community + เครื่องมือช่วยวิเคราะห์ + Support เพื่อให้คุณค่อย ๆ สร้างพอร์ตของตัวเองอย่างมีระบบ</p>
          <div className="badges"><span className="badge">เรียนตลอดชีพ</span><span className="badge">Web App ฟรีตลอดชีพ</span><span className="badge">LINE Group ตลอดชีพ</span></div>
          <div className="price">390 บาท</div><div className="spacer"/><CTA/>
          <p className="disclaimer">เนื้อหาเพื่อการศึกษา ไม่ใช่คำแนะนำซื้อขายหลักทรัพย์ ผลลัพธ์จากการลงทุนแตกต่างกันในแต่ละบุคคล</p>
        </div>

      </div></section>

      <section className="section story-section"><div className="container">
        <div className="grid2"><div><span className="eyebrow">จากประสบการณ์จริง</span><h2 className="h2">ผมเริ่มต้นจากเงิน 5,000 บาท และค่อย ๆ สร้างพอร์ตจนเกิน 100,000 บาท</h2><p className="lead">สิ่งที่เกิดขึ้นไม่ได้มาจากการเอา 5,000 บาทไปเสี่ยงกับหุ้นตัวเดียว แต่เกิดจากการเรียนรู้ วางระบบ เติมเงินลงทุนอย่างต่อเนื่อง และนำกำไรหรือเงินปันผลกลับไปลงทุน</p><div className="list"><div>ศึกษาและคัดเลือกหุ้นอย่างมีเหตุผล</div><div>แบ่งเงินลงทุนตามแผนของตัวเอง</div><div>เติมเงินสม่ำเสมอ และให้เวลากับพอร์ต</div><div>ใช้ความรู้เรื่องดอกเบี้ยทบต้นเป็นส่วนหนึ่งของแผน</div></div></div><div className="card"><h3>สิ่งสำคัญ</h3><p className="muted">ประสบการณ์นี้มีการเติมเงินเข้าพอร์ตอย่างต่อเนื่อง ไม่ใช่การเปลี่ยนเงิน 5,000 บาทให้เป็น 100,000 บาทจากผลตอบแทนเพียงอย่างเดียว และไม่ใช่การรับประกันผลลัพธ์ในอนาคต</p></div></div>
      </div></section>

      <section className="section"><div className="container"><span className="eyebrow">ถ้าคุณกำลังติดอยู่ตรงนี้</span><h2 className="h2">อยากเริ่ม แต่ข้อมูลเยอะจนไม่รู้ว่าควรเริ่มตรงไหนก่อน</h2><div className="proof"><div className="card"><strong>01</strong><p>หุ้นมีหลายตัว ไม่รู้ว่าควรศึกษาอย่างไร</p></div><div className="card"><strong>02</strong><p>เปิดงบการเงินแล้วไม่รู้ว่าต้องดูอะไร</p></div><div className="card"><strong>03</strong><p>ยังไม่มั่นใจเรื่องภาษีและขั้นตอนต่าง ๆ</p></div></div></div></section>

      <section className="section combo-overview-section"><div className="container">
        <div className="combo-overview-heading">
          <span className="eyebrow">สิ่งที่คุณจะได้รับ</span>
          <h2 className="h2">390 บาท ได้ครบ 7 สิทธิ์อะไรบ้าง?</h2>
          <p className="lead">เลื่อนดูทีละรายการ เพื่อดูว่าสิ่งที่อยู่ในชุดช่วยคุณเรียนรู้และเริ่มวิเคราะห์หุ้นอย่างไร</p>
        </div>
        <OfferCarousel />
      </div></section>

      <section className="section value-section"><div className="container">
        <div className="value-box">
          <span className="eyebrow">ครบในชุดเดียว</span>
          <h2 className="h2">เริ่มเรียนรู้ด้วยความรู้ เครื่องมือ Community และ Support ในชุดเดียว</h2>
          <p className="value-summary">E-book + 2 คอร์ส + Checklist + Web App + LINE Community + Private Support</p>
          <div className="value-price">
            <span>ชำระครั้งเดียว</span><strong>390 บาท</strong>
          </div>
          <CTA label="เริ่มเรียนรู้ด้วยชุดนี้ 390 บาท →"/>
          <p className="disclaimer">เนื้อหาและเครื่องมือใช้เพื่อการศึกษา ไม่รับประกันผลตอบแทนจากการลงทุน</p>
        </div>
      </div></section>

      <section className="section preview-section"><div className="container">
        <span className="eyebrow">ดูก่อนตัดสินใจ</span>
        <h2 className="h2">ดูของจริงที่คุณจะได้รับ</h2>
        <p className="lead">ลองอ่าน E-book และดูวิดีโอรีวิวคอร์สกับ Web App ก่อนตัดสินใจ เพื่อให้เห็นรูปแบบเนื้อหาและการใช้งานจริง</p>
        <div className="preview-grid">
          <article className="preview-card ebook-preview">
            <div className="preview-icon">📖</div>
            <h3>E-book “อาณาจักรหุ้นปันผล”</h3>
            <p className="muted">เปิดอ่านตัวอย่างจริง 26 หน้า จาก E-book ฉบับเต็ม 223 หน้า</p>
            <a className="preview-btn" href="/ebook-preview.pdf" target="_blank" rel="noopener noreferrer">อ่านตัวอย่าง E-book 26 หน้า →</a>
          </article>
          <article className="preview-card">
            <div className="preview-icon">🎓</div>
            <h3>ดูรีวิวคอร์ส</h3>
            <p className="muted">ดูรูปแบบคอร์สและบรรยากาศการเรียนก่อนตัดสินใจ</p>
            <div className="video-short"><iframe src="https://www.youtube.com/embed/fiA4GVfTq90" title="รีวิวคอร์ส Passive Income" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
          </article>
          <article className="preview-card">
            <div className="preview-icon">🛠️</div>
            <h3>ดู Web App ทำงานจริง</h3>
            <p className="muted">ชมการใช้งานเครื่องมือที่รวมอยู่ในชุดนี้</p>
            <div className="video-wide"><iframe src="https://www.youtube.com/embed/kG4dQaeWPwY" title="รีวิว Web App วิเคราะห์หุ้น" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
          </article>
        </div>
        <p className="preview-note">ตัวอย่างทั้งหมดเปิดให้ดูก่อนตัดสินใจ • ไม่ต้องสมัครสมาชิก</p>
      </div></section>

      <section className="section"><div className="container webapp"><div><span className="eyebrow">เครื่องมือเด่นในชุด</span><h2 className="h2">ไม่ได้มีแค่บทเรียน คุณยังได้ Web App ไปใช้ต่อ</h2><p className="lead">สมาชิกได้รับสิทธิ์ใช้งาน Web App ฟรีตลอดชีพ เพื่อช่วยจัดข้อมูลและคำนวณตัวเลขที่ใช้ประกอบการเรียนรู้และวิเคราะห์หุ้น</p><div className="badges"><span className="badge">สรุปหุ้น</span><span className="badge">ข้อมูลพื้นฐาน</span><span className="badge">ต้นทุนเฉลี่ย</span><span className="badge">ดอกเบี้ยทบต้น</span></div></div><div className="card"><h3>มีเครื่องมือช่วยวิเคราะห์ในชุด</h3><p className="muted">ใช้ประกอบการดูข้อมูลพื้นฐาน คำนวณต้นทุนเฉลี่ย และวางแผนด้วยตัวเลขได้สะดวกขึ้น โดยวิดีโอสาธิตอยู่ในส่วนตัวอย่างด้านบน</p><div className="badges"><span className="badge">ใช้งานผ่านเว็บ</span><span className="badge">รองรับมือถือ</span><span className="badge">ไม่มีค่ารายเดือนสำหรับสมาชิกชุดนี้</span></div></div></div></section>

      <section className="section community-review-section"><div className="container grid2 community-review-grid">
        <div>
          <span className="eyebrow">Community ที่ใช้งานจริง</span>
          <h2 className="h2">ดูบรรยากาศกลุ่ม LINE ก่อนตัดสินใจ</h2>
          <p className="lead">หลังซื้อไม่ได้มีแค่ E-book และคอร์ส แต่ยังมีพื้นที่ให้พูดคุย ถาม–ตอบ และติดตามเนื้อหาเพิ่มเติมร่วมกับสมาชิกคนอื่น ๆ</p>
          <div className="list">
            <div>พูดคุยและแลกเปลี่ยนกับสมาชิกในกลุ่ม</div>
            <div>ติดตามเนื้อหาและประกาศที่เกี่ยวข้อง</div>
            <div>ใช้เป็นพื้นที่ต่อยอดจากบทเรียน ไม่ต้องเรียนอยู่คนเดียว</div>
          </div>
          <div className="badges"><span className="badge">เข้ากลุ่มได้ตลอดชีพ</span><span className="badge">สมาชิกใช้งานจริง</span></div>
        </div>
        <div className="community-video-card">
          <div className="video-short"><iframe src="https://www.youtube.com/embed/o5d2pH7nQLs" title="รีวิวกลุ่ม LINE Passive Income" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>
          <p className="muted center">รีวิวบรรยากาศกลุ่ม LINE จริง</p>
        </div>
      </div></section>

      <section className="section reviews-section"><div className="container"><span className="eyebrow">เสียงจากผู้อ่านและสมาชิกจริง</span><h2 className="h2">รีวิวจากผู้ที่ได้อ่านและใช้งานจริง</h2><p className="lead">เปิดดูรีวิวทีละภาพได้อย่างชัดเจน และบนมือถือสามารถปัดซ้าย–ขวาเพื่ออ่านต่อได้</p><ReviewsCarousel /></div></section>

      <section className="section"><div className="container"><div className="cta-box"><span className="eyebrow">เริ่มต้นได้วันนี้</span><h2 className="h2">พอร์ตแรกไม่จำเป็นต้องเริ่มจากเงินก้อนใหญ่ แต่ควรเริ่มจากความเข้าใจ</h2><p className="muted">รับสิทธิ์การเรียนรู้และเครื่องมือทั้งหมดในชุด</p><div className="price">390 บาท</div><p className="muted">คอร์สตลอดชีพ • Web App ตลอดชีพ • LINE Group ตลอดชีพ</p><CTA/><p className="disclaimer">การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลและตัดสินใจด้วยตนเอง</p></div></div></section>

      <section className="section audience-section"><div className="container">
        <span className="eyebrow">ชุดนี้เหมาะกับคุณไหม?</span>
        <h2 className="h2">ออกแบบสำหรับคนที่อยาก “เข้าใจและทำเอง”</h2>
        <div className="audience-grid">
          <div className="audience-card yes"><h3>เหมาะกับคุณ ถ้า...</h3><div className="list"><div>เพิ่งเริ่มสนใจหุ้นสหรัฐฯ และอยากมีลำดับการเรียนที่ชัดเจน</div><div>สนใจลงทุนระยะยาว หุ้นปันผล และอยากสร้างพอร์ตของตัวเอง</div><div>อยากอ่านข้อมูลพื้นฐานและใช้เครื่องมือประกอบการตัดสินใจด้วยตัวเอง</div></div></div>
          <div className="audience-card no"><h3>อาจไม่เหมาะ ถ้า...</h3><div className="list"><div>กำลังมองหาหุ้นเด็ดหรือสัญญาณซื้อขายแบบไม่ต้องวิเคราะห์เอง</div><div>คาดหวังกำไรเร็วหรือผลตอบแทนที่รับประกันได้</div><div>ต้องการให้ผู้อื่นตัดสินใจซื้อ–ขายหลักทรัพย์แทนคุณ</div></div></div>
        </div>
      </div></section>

      <section className="section"><div className="container"><h2 className="h2">คำถามที่พบบ่อย</h2><div className="list"><div><strong>ไม่มีพื้นฐานเลย เรียนได้ไหม?</strong><br/><span className="muted">ได้ เนื้อหาออกแบบให้เริ่มจากพื้นฐาน</span></div><div><strong>เรียนได้นานแค่ไหน?</strong><br/><span className="muted">เรียนย้อนหลังได้ตลอดชีพ</span></div><div><strong>Web App มีค่ารายเดือนหรือไม่?</strong><br/><span className="muted">สมาชิกชุดนี้ได้รับสิทธิ์ใช้งานฟรีตลอดชีพ ตามเงื่อนไขการให้บริการของระบบ</span></div><div><strong>มีคำถามหลังเรียนทำอย่างไร?</strong><br/><span className="muted">สอบถามผ่าน LINE ส่วนตัวได้ในขอบเขตบทเรียนและการใช้งานเครื่องมือ</span></div></div></div></section>
    </main>
    <footer className="footer"><div className="container">© 2026 Passive Income Starter Set • เนื้อหาเพื่อการศึกษา</div></footer>
  </>
}
