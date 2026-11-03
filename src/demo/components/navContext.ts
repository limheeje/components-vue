import {inject, provide, ref, type ComputedRef, type InjectionKey, type Ref} from 'vue'

/**
 * 사이드바 항목/하위항목 클릭 시 열 페이지의 PropTabs 초기 탭을 지정한다.
 * seq 는 클릭마다 증가 — 같은 tab 을 다시 눌러도(Input › Password 등) 반영되도록.
 */
export interface DemoTabState {
  tab: string | null
  seq: number
}

export const DEMO_TAB_KEY = Symbol('demo-tab') as InjectionKey<Ref<DemoTabState>>

export function provideDemoTab(state: Ref<DemoTabState> | ComputedRef<DemoTabState>) {
  provide(DEMO_TAB_KEY, state as Ref<DemoTabState>)
}

export function useDemoTab(): Ref<DemoTabState> {
  return inject(DEMO_TAB_KEY, null) ?? ref<DemoTabState>({tab: null, seq: 0})
}

/**
 * 페이지 본문(예: HomePage 카드)에서 다른 페이지로 이동할 때 사용.
 * React `DemoNavContext` 대응.
 */
export type DemoNavigate = (key: string, tab?: string) => void

export const DEMO_NAV_KEY = Symbol('demo-nav') as InjectionKey<DemoNavigate>

export function provideDemoNav(fn: DemoNavigate) {
  provide(DEMO_NAV_KEY, fn)
}

export function useDemoNav(): DemoNavigate {
  return inject(DEMO_NAV_KEY, () => {})
}
