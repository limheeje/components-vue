import type {CASCADER_EXPAND_TRIGGER, CASCADER_SIZE} from '~/components/Cascader/Cascader.constant'

export type CascaderSize = (typeof CASCADER_SIZE)[keyof typeof CASCADER_SIZE]
export type CascaderExpandTrigger = (typeof CASCADER_EXPAND_TRIGGER)[keyof typeof CASCADER_EXPAND_TRIGGER]

export type CascaderValue = string | number

/** 옵션 한 개. 키 이름은 `config.value/label/children/disabled/leaf` 로 바꿀 수 있다 */
export interface CascaderOption {
  label?: string
  value?: CascaderValue
  children?: CascaderOption[]
  disabled?: boolean
  /** 동적 로딩에서 더 이상 하위가 없음을 미리 알릴 때 */
  leaf?: boolean
  [key: string]: unknown
}

/** 내부 트리 노드 (slot · lazyLoad · getCheckedNodes 에서 노출) */
export interface CascaderNode {
  uid: number
  /** 원본 옵션 */
  data: CascaderOption
  value: CascaderValue
  label: string
  /** 1부터 시작 (루트 pseudo 노드는 0) */
  level: number
  parent: CascaderNode | null
  children: CascaderNode[]
  disabled: boolean
  leaf: boolean
  /** 하위 노드가 로드되었는지 (lazy) */
  loaded: boolean
  loading: boolean
  /** 루트부터 이 노드까지의 value / label */
  pathValues: CascaderValue[]
  pathLabels: string[]
}

/** 동적 로딩 — 하위 옵션을 `resolve` 로 넘긴다 (빈 배열/undefined 면 leaf 처리) */
export type CascaderLazyLoad = (node: CascaderNode, resolve: (data?: CascaderOption[]) => void) => void

export interface CascaderConfig {
  /** 하위 메뉴 펼침 방식. 기본값 click */
  expandTrigger?: CascaderExpandTrigger
  /** 다중 선택. 기본값 false */
  multiple?: boolean
  /** 부모/자식과 무관하게 아무 레벨이나 선택. 기본값 false */
  checkStrictly?: boolean
  /** true 면 경로 배열, false 면 마지막 value 만 emit. 기본값 true */
  emitPath?: boolean
  /** 동적 로딩 (lazyLoad 필요). 기본값 false */
  lazy?: boolean
  lazyLoad?: CascaderLazyLoad
  /** 옵션 객체의 키 이름 매핑 */
  value?: string
  label?: string
  children?: string
  disabled?: string
  leaf?: string
}

/** v-model 값. 단일+emitPath → 경로, 다중+emitPath → 경로 배열, emitPath=false → value(들) */
export type CascaderModelValue = CascaderValue | CascaderValue[] | CascaderValue[][]

export type CascaderFilterMethod = (node: CascaderNode, keyword: string) => boolean
export type CascaderBeforeFilter = (keyword: string) => boolean | Promise<unknown> | void

export interface CascaderPanelProps {
  /** 옵션 트리 */
  options?: CascaderOption[]
  /** 동작 설정 (multiple · checkStrictly · emitPath · lazy · 키 매핑 …) */
  config?: CascaderConfig
  /** 제어 값. `v-model` 로 양방향 바인딩 */
  modelValue?: CascaderModelValue
  /** 비제어 초기값 */
  defaultValue?: CascaderModelValue
  /** 추가 클래스 (string | string[]) */
  classNames?: string | string[]
}

export interface CascaderProps extends CascaderPanelProps {
  /** 미선택 상태 안내 문구. 기본값 "선택해주세요" */
  placeholder?: string
  /** 크기. 기본값 md */
  size?: CascaderSize
  /** 비활성 */
  disabled?: boolean
  /** 선택 값 지우기 아이콘 (hover 시 노출) */
  clearable?: boolean
  /** 선택 결과에 모든 레벨 표시. false 면 마지막 레벨만. 기본값 true */
  showAllLevels?: boolean
  /** 다중 선택에서 태그를 첫 개 + "+N" 으로 접기 */
  collapseTags?: boolean
  /** 레벨 구분자. 기본값 " / " */
  separator?: string
  /** 옵션 검색 */
  filterable?: boolean
  /** 커스텀 검색 로직. true 반환 시 매치 */
  filterMethod?: CascaderFilterMethod
  /** 입력 후 검색까지 지연(ms). 기본값 300 */
  debounce?: number
  /** 검색 직전 훅. false 또는 reject 되는 Promise 를 반환하면 검색 취소 */
  beforeFilter?: CascaderBeforeFilter
  /** 에러 상태. 문자열이면 컨트롤 하단에 메시지로 표시 */
  error?: boolean | string
  /** 보조 안내 문구 (error 가 없을 때만 표시). slot 으로도 지정 가능 */
  helperText?: string
  /** form 연동용 name (hidden input) */
  name?: string
  /** 트리거 id */
  id?: string
}
