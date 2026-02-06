/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useCallback, useMemo, useState } from 'react'

import RecruitmentCard from '@/components/layout/RecruitmentCard'

import styles from './branding-card-result-company.module.css'

export default function BrandingCardResultCompanyPage() {
  const tips = useMemo(
    () => [
      '회사 소개에는 “우리가 무엇을 하는가”보다 “왜 하는가”를 먼저 강조해보세요.',
      '추상적인 표현보다 실제 사례를 포함하면 신뢰도가 크게 올라갑니다.',
      '지원자가 얻게 될 경험을 구체적으로 작성하면 지원 전환율이 높아집니다.',
      '기업의 문화는 ‘형용사’보다 ‘행동 방식’으로 설명하는 것이 효과적입니다.',
    ],
    [],
  )
  const [tipIndex, setTipIndex] = useState(0)

  const handleRandomTip = useCallback(() => {
    setTipIndex((prev) => {
      if (tips.length <= 1) return prev
      let next = prev
      while (next === prev) next = Math.floor(Math.random() * tips.length)
      return next
    })
  }, [tips])

  return (
    <div className={styles.wrap}>
      <header className={styles.topRow}>
        <div className={styles.hero}>
          <div className={styles.kicker}>AI BRANDING STUDIO</div>
          <h1 className={styles.title}>
            우리 기업만의 <span className={styles.accent}>AI 브랜딩 카드</span>를
            완성하세요
          </h1>
          <p className={styles.subTitle}>
            AI가 분석한 기업 정보를 바탕으로 생성된 카드입니다.
            <br />
            이 카드가 우리 기업을 더 잘 표현할 수 있도록 문구를 자유롭게
            수정해보세요.
          </p>
        </div>

        <div className={styles.actions} aria-label="Actions">
          <button className={styles.secondaryButton} type="button" disabled>
            AI 다시 생성하기
          </button>
          <button className={styles.primaryButton} type="button" disabled>
            최종 저장 및 공개
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.leftCol} aria-label="Preview">
          <div className={styles.previewHeader}>
            <div className={styles.previewTitleRow}>
              <span className={styles.previewDot} aria-hidden />
              <div className={styles.previewTitle}>실시간 미리보기</div>
              <div className={styles.previewHint}>구직자에게 보여지는 화면입니다</div>
            </div>
          </div>

          <div className={styles.previewCardWrap}>
            <div className={styles.previewScaled}>
              <RecruitmentCard
                variant="preview"
                companyName="TECHWAVE"
                companyDesc="AI 브랜딩 스튜디오"
                matchRate={98}
                tags={['#자율출퇴근', '#무제한휴가', '#성장지원금']}
                image={gradient('0b63ff', '0b1220')}
              />
            </div>
          </div>
        </section>

        <section className={styles.rightCol} aria-label="Editor">
          <div className={styles.editorCard}>
            <div className={styles.notice}>
              <div className={styles.noticeIcon} aria-hidden>
                i
              </div>
              <div className={styles.noticeText}>
                <div className={styles.noticeTitle}>기업 브랜딩 문구 편집</div>
                <div className={styles.noticeBody}>
                  이 카드가 우리 기업을 가장 잘 브랜딩 할 수 있도록 문구를
                  수정해보세요.
                  <br />
                  매력적인 문구는 지원율을 평균 45% 향상시킵니다.
                </div>
              </div>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>
                    메인 슬로건 (Catchphrase) <span className={styles.aiChip}>AI 추천</span>
                  </div>
                  <div className={styles.counter}>24 / 40자</div>
                </div>
                <div className={styles.inputRow}>
                  <input
                    className={styles.input}
                    placeholder="예: 기술로 세상을 더 심플하게 만드는 사람들"
                  />
                  <button
                    className={styles.refreshButton}
                    type="button"
                    disabled
                    aria-label="AI 재추천"
                    title="AI 재추천"
                  >
                    ↻
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>기업 한 줄 소개 (Description)</div>
                  <div className={styles.counter}>52 / 100자</div>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="자유로운 소통과 성장이 공존하는 우리 기업을 소개해보세요."
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>핵심 키워드 해시태그 (Keywords)</div>
                </div>
                <div className={styles.chips}>
                  {['#자율출퇴근', '#무제한휴가', '#성장지원금'].map((t) => (
                    <span key={t} className={styles.chip}>
                      {t} <span className={styles.chipX}>×</span>
                    </span>
                  ))}
                  <button className={styles.chipAdd} type="button" disabled>
                    + 키워드 추가
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>AI 브랜딩 카드 재생성 프롬프트 (Prompt)</div>
                  <div className={styles.counter}>52 / 100자</div>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="AI가 더 좋은 브랜딩 문구를 만들 수 있도록 프롬프트를 수정해보세요."
                />
              </div>
            </div>
          </div>

          <div className={styles.tipCard} aria-label="Branding tip">
            <div className={styles.tipLeft}>
              <span className={styles.tipIcon} aria-hidden>
                💡
              </span>
              <div>
                <div className={styles.tipTitle}>브랜딩 팁</div>
                <div className={styles.tipBody}>{tips[tipIndex]}</div>
              </div>
            </div>
            <button
              className={styles.tipButton}
              type="button"
              onClick={handleRandomTip}
            >
              다른 예시 보기
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function gradient(colorA: string, colorB: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <radialGradient id="g1" cx="20%" cy="20%" r="90%">
        <stop offset="0%" stop-color="#${colorA}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="#${colorA}" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#${colorB}" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${colorB}"/>
        <stop offset="100%" stop-color="#${colorB}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g2)"/>
    <rect width="1200" height="800" fill="url(#g1)"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
