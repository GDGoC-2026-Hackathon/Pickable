/**
 * 카카오(다음) 우편번호 API 연동
 * 주소 검색 시 Daum Postcode 팝업을 띄우고 선택한 주소를 반환합니다.
 * @see https://postcode.map.daum.net/guide
 */

declare global {
  interface Window {
    daum?: {
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

/** 선택한 주소 + 우편번호(zonecode) */
export type DaumPostcodeResult = {
  address: string
  zonecode: string
}

/** 카카오(다음) 우편번호 서비스 공식 스크립트 (Key 불필요, 무료) */
const SCRIPT_URL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

let scriptLoadPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.daum?.Postcode) return Promise.resolve()
  if (scriptLoadPromise) return scriptLoadPromise
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('카카오 우편번호 서비스 로드 실패'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

function buildFullAddress(data: DaumPostcodeData): string {
  let addr = ''
  let extraAddr = ''

  if (data.userSelectedType === 'R') {
    addr = data.roadAddress || data.address
    if (data.bname && /[동로가]$/.test(data.bname)) extraAddr += data.bname
    if (data.buildingName && data.apartment === 'Y') {
      extraAddr += extraAddr ? `, ${data.buildingName}` : data.buildingName
    }
  } else {
    addr = data.jibunAddress || data.address
  }

  return addr ? (extraAddr ? `${addr} (${extraAddr})` : addr) : data.address
}

/**
 * 카카오(다음) 우편번호 API 팝업을 열고, 주소 선택 시 onComplete(주소 문자열)를 호출합니다.
 */
export function openDaumPostcode(
  onComplete: (address: string) => void
): Promise<void> {
  return loadScript().then(() => {
    if (!window.daum?.Postcode) {
      throw new Error('카카오 우편번호 서비스를 사용할 수 없습니다.')
    }
    new window.daum.Postcode({
      oncomplete(data: DaumPostcodeData) {
        onComplete(buildFullAddress(data))
      },
    }).open()
  })
}

/** 주소 + 우편번호(zonecode)를 함께 받고 싶을 때 사용 */
export function openDaumPostcodeWithZonecode(
  onComplete: (result: DaumPostcodeResult) => void
): Promise<void> {
  return loadScript().then(() => {
    if (!window.daum?.Postcode) {
      throw new Error('카카오 우편번호 서비스를 사용할 수 없습니다.')
    }
    new window.daum.Postcode({
      oncomplete(data: DaumPostcodeData) {
        onComplete({
          address: buildFullAddress(data),
          zonecode: data.zonecode,
        })
      },
    }).open()
  })
}
