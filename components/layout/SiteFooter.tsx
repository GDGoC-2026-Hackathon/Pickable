import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandSmall}>Pickable</div>
            <p className={styles.footerDesc}>
              중소기업과 취준생의 성장을 연결하는, 리크루팅/브랜딩 플랫폼입니다.
            </p>
            <div className={styles.socialRow} aria-label="social links">
              <a className={styles.socialDot} href="#" aria-label="Instagram">
                <img className={styles.socialIcon} src="/icons/ig.png" alt="" />
              </a>
              <a className={styles.socialDot} href="#" aria-label="LinkedIn">
                <img
                  className={styles.socialIcon}
                  src="/icons/linkedin.png"
                  alt=""
                />
              </a>
              <a className={styles.socialDot} href="#" aria-label="YouTube">
                <img
                  className={styles.socialIcon}
                  src="/icons/youtube.png"
                  alt=""
                />
              </a>
            </div>
          </div>

          <FooterCol
            title="기업 서비스"
            items={[
              { label: 'AI 브랜딩 카드 제작', tone: 'muted' },
              { label: '프리미엄 브랜딩 컨설팅', tone: 'muted' },
              { label: '기업용 채용 서비스', tone: 'muted' },
            ]}
          />
          <FooterCol
            title="취준생 서비스"
            items={[
              { label: '기업 추천 받기', tone: 'muted' },
              { label: '채용 캘린더', tone: 'muted' },
              { label: '커리어 로드맵', tone: 'muted' },
            ]}
          />
          <FooterCol
            title="고객 지원"
            items={[
              { label: '공지사항', tone: 'muted' },
              { label: 'FAQ', tone: 'muted' },
              { label: '1:1 문의하기', tone: 'muted' },
            ]}
          />
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>© 2026 Pickable</div>
          <div className={styles.footerLinks}>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

type FooterItem = string | { label: string; tone?: 'muted' | 'normal' }

function FooterCol({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div className={styles.footerCol} aria-label={title}>
      <div className={styles.footerColTitle}>{title}</div>
      <ul className={styles.footerList}>
        {items.map((item) => {
          const label = typeof item === 'string' ? item : item.label
          const tone = typeof item === 'string' ? 'normal' : item.tone ?? 'normal'
          const itemClass =
            tone === 'muted' ? styles.footerItemMuted : styles.footerItem

          return (
            <li key={label} className={itemClass}>
              {label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
