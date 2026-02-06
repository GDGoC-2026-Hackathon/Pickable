import RecruitmentCard, { RecruitmentCardProps } from './RecruitmentCard'
import styles from './FlippableRecruitmentCard.module.css'

type Side = 'front' | 'back'

type FlippableRecruitmentCardProps = {
  front: RecruitmentCardProps
  back?: RecruitmentCardProps
  side?: Side
  flipOnHover?: boolean
  className?: string
}

export default function FlippableRecruitmentCard({
  front,
  back,
  side = 'front',
  flipOnHover = false,
  className,
}: FlippableRecruitmentCardProps) {
  if (!back) {
    return <RecruitmentCard {...front} />
  }

  const rootClass = [
    styles.flip,
    flipOnHover ? styles.flipHover : '',
    side === 'back' ? styles.startBack : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const innerClass = [
    styles.flipInner,
    side === 'back' ? styles.isBack : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass}>
      <div className={innerClass}>
        <div className={styles.flipFace}>
          <RecruitmentCard {...front} />
        </div>
        <div className={`${styles.flipFace} ${styles.flipBack}`}>
          <RecruitmentCard {...back} />
        </div>
      </div>
    </div>
  )
}
