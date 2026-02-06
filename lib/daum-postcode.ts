/**
 * Kakao Daum 우편번호 서비스 연동
 * @see https://postcode.map.daum.net/guide
 */

declare global {
  interface Window {
    kakao?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void
      }) => DaumPostcode
    }
  }
}

export interface DaumPostcodeData {
  zonecode: string
  address: string
  roadAddress: string
  jibunAddress: string
  userSelectedType: 'R' | 'J'
  bname?: string
  buildingName?: string
  apartment?: string
}

export interface DaumPostcode {
  open(): void
}

const SCRIPT_URL =
  'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

let scriptLoadPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }
  if (window.kakao?.Postcode) {
    return Promise.resolve()
  }
  if (scriptLoadPromise) {
    return scriptLoadPromise
  }
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('우편번호 서비스 로드 실패'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

export function openDaumPostcode(
  onComplete: (address: string) => void
): Promise<void> {
  return loadScript().then(() => {
    if (!window.kakao?.Postcode) {
      throw new Error('우편번호 서비스를 사용할 수 없습니다.')
    }
    new window.kakao.Postcode({
      oncomplete(data: DaumPostcodeData) {
        // 사용자가 선택한 주소 타입에 따라 기본 주소 조합
        // 도로명(R) / 지번(J) 선택 시 해당 주소 + 참고항목
        let addr = ''
        let extraAddr = ''

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress || data.address
          // 법정동명이 있고, 법정동/로/가로 끝나면 추가 (도로명주소법 시행령)
          if (data.bname && /[동로가]$/.test(data.bname)) {
            extraAddr += data.bname
          }
          // 건물명이 있고 공동주택이면 추가
          if (data.buildingName && data.apartment === 'Y') {
            extraAddr += extraAddr ? `, ${data.buildingName}` : data.buildingName
          }
        } else {
          addr = data.jibunAddress || data.address
        }

        const fullAddr = addr ? (extraAddr ? `${addr} (${extraAddr})` : addr) : data.address
        onComplete(fullAddr)
      },
    }).open()
  })
}
