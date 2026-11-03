/** 시/도 하나 + 소속 시군구 목록 */
export interface RegionGroup {
  /** 시/도 이름 (예: '전남') */
  province: string
  /** 시군구 이름 목록 (가나다순 권장) */
  cities: string[]
}

/** 선택 결과 (시군구 1개) */
export interface RegionValue {
  province: string
  city: string
}

/** v-model 값. multiple=false 면 RegionValue | null, multiple=true 면 RegionValue[] */
export type RegionPickerModelValue = RegionValue | RegionValue[] | null

export interface RegionPickerProps {
  /** 열림 상태 (제어) */
  open: boolean
  /** 선택값 (제어, v-model). multiple 여부에 따라 단일 객체 또는 배열 */
  modelValue?: RegionPickerModelValue
  /** 다중 선택 (여러 시군구 선택 가능). 기본값 true */
  multiple?: boolean
  /** 헤더 제목. 기본값 '시군구 선택' */
  title?: string
  /** 안내문(미선택 상태에서 표시). 기본값 '행정구역을 선택하세요.' */
  hint?: string
  /** 선택 데이터. 기본값은 대한민국 17개 시/도 + 시군구 내장 목록 */
  regions?: RegionGroup[]
  /** 하단 확정 버튼 라벨. 기본값 multiple=false 면 '선택', multiple=true 면 '적용하기' */
  confirmText?: string
  /** multiple=true 전체 초기화 버튼 라벨. 기본값 '초기화' */
  resetText?: string
  /** 배경 클릭으로 닫기. 기본값 true */
  closeOnBackdrop?: boolean
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}
