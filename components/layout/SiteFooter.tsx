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
              'AI 브랜딩 카드 제작',
              '프리미엄 브랜딩 컨설팅',
              '기업용 채용 서비스',
            ]}
          />
          <FooterCol
            title="취준생 서비스"
            items={['기업 추천 받기', '채용 캘린더', '커리어 로드맵']}
          />
          <FooterCol
            title="고객 지원"
            items={['공지사항', 'FAQ', '1:1 문의하기']}
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

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className={styles.footerCol} aria-label={title}>
      <div className={styles.footerColTitle}>{title}</div>
      <ul className={styles.footerList}>
        {items.map((item) => (
          <li key={item} className={styles.footerItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
