<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button, {BUTTON_SIZE, BUTTON_VARIANT} from '~/components/Button'
import Tabs from '~/components/Tabs'
import {showToast, ToastProvider, TOAST_POSITION, TOAST_TYPE, TOAST_VARIANT} from '~/components/Toast'
import type {ToastType} from '~/components/Toast'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['demo', 'tab-trigger', 'type', 'position', 'dismissible', 'duration', 'action', 'variant', 'usage']

// 데모/코드예시 모두 export 상수 키로 순회
const TYPE_KEYS = Object.keys(TOAST_TYPE) as (keyof typeof TOAST_TYPE)[]
const POSITION_KEYS = Object.keys(TOAST_POSITION) as (keyof typeof TOAST_POSITION)[]
const TYPES = Object.values(TOAST_TYPE)
const POSITIONS = Object.values(TOAST_POSITION)

const TYPE_COLOR: Record<string, string> = {
  success: 'var(--m2m-pg-success)',
  error: 'var(--m2m-pg-error)',
  warning: 'var(--m2m-pg-warning)',
  info: 'var(--m2m-pg-info)'
}
const TYPE_LABEL: Record<string, string> = {success: '성공', error: '오류', warning: '경고', info: '정보'}

const groupLabel = 'font-size:12px;font-weight:600;color:var(--m2m-pg-comp-text-muted);margin-bottom:10px'
const callout = (tone: 'info' | 'warning') =>
  `font-size:13px;color:var(--m2m-pg-comp-text-muted);padding:10px 14px;border-radius:8px;background:var(--m2m-pg-${tone}-bg);border:1px solid var(--m2m-pg-${tone}-border)`

const ClickDemo = defineComponent({
  name: 'ToastClickDemo',
  setup() {
    return () =>
      h('div', {style: 'display:flex;flex-direction:column;gap:16px'}, [
        h('div', {style: callout('info')}, '💡 아래 버튼을 클릭하면 화면 우측 상단에 실제 토스트가 나타납니다.'),
        h('div', {}, [
          h('div', {style: groupLabel}, '타입별 토스트'),
          h(
            'div',
            {class: 'demo-row'},
            TYPES.map((t) =>
              h(
                'button',
                {
                  key: t,
                  type: 'button',
                  style: `padding:8px 18px;border-radius:8px;border:none;background:${TYPE_COLOR[t]};color:#fff;cursor:pointer;font-size:13px;font-weight:600`,
                  onClick: () =>
                    showToast({
                      type: t,
                      message: `${TYPE_LABEL[t]} 메시지입니다.`,
                      duration: 3000,
                      position: TOAST_POSITION['TOP_RIGHT']
                    })
                },
                `${TYPE_LABEL[t]} 토스트`
              )
            )
          )
        ]),
        h('div', {}, [
          h('div', {style: groupLabel}, '위치별 토스트'),
          h(
            'div',
            {class: 'demo-row'},
            POSITIONS.map((pos) =>
              h(
                'button',
                {
                  key: pos,
                  type: 'button',
                  style:
                    'padding:7px 14px;border-radius:8px;border:1px solid var(--m2m-pg-comp-border-sub);background:var(--m2m-pg-comp-bg);color:var(--m2m-pg-comp-text-sub);cursor:pointer;font-size:12px',
                  onClick: () =>
                    showToast({type: TOAST_TYPE['INFO'], message: `position: ${pos}`, duration: 2500, position: pos})
                },
                pos
              )
            )
          )
        ]),
        h('div', {}, [
          h('div', {style: groupLabel}, '액션 버튼 · 변형'),
          h('div', {class: 'demo-row'}, [
            h(
              Button,
              {
                size: BUTTON_SIZE['SM'],
                variant: BUTTON_VARIANT['SECONDARY'],
                onClick: () =>
                  showToast({
                    type: TOAST_TYPE['INFO'],
                    message: '파일이 삭제되었습니다.',
                    duration: 4000,
                    action: {
                      label: '실행 취소',
                      onClick: () => showToast({type: TOAST_TYPE['SUCCESS'], message: '복원됨'})
                    }
                  })
              },
              () => '실행 취소 포함'
            ),
            h(
              Button,
              {
                size: BUTTON_SIZE['SM'],
                variant: BUTTON_VARIANT['GHOST'],
                onClick: () =>
                  showToast({
                    type: TOAST_TYPE['SUCCESS'],
                    message: '저장 완료! 목록으로 이동합니다.',
                    duration: 3500,
                    variant: TOAST_VARIANT['LIGHT']
                  })
              },
              () => 'Light 변형'
            )
          ])
        ])
      ])
  }
})

const MENU: {key: string; label: string; type: ToastType; msg: string}[] = [
  {key: 'save', label: '저장', type: TOAST_TYPE['SUCCESS'], msg: '저장이 완료되었습니다.'},
  {key: 'delete', label: '삭제', type: TOAST_TYPE['DANGER'], msg: '항목이 삭제되었습니다.'},
  {key: 'warn', label: '경고', type: TOAST_TYPE['WARNING'], msg: '주의: 변경 사항이 있습니다.'},
  {key: 'info', label: '안내', type: TOAST_TYPE['INFO'], msg: '처리 중입니다. 잠시 기다려주세요.'}
]

const TabToastDemo = defineComponent({
  name: 'ToastTabDemo',
  setup() {
    const active = ref('save')
    return () =>
      h('div', {style: 'display:flex;flex-direction:column;gap:12px;width:420px;max-width:100%'}, [
        h('div', {style: callout('warning')}, '💡 탭 메뉴를 클릭하면 해당 타입의 토스트가 발생합니다.'),
        h(
          Tabs,
          {
            activeKey: active.value,
            items: MENU.map((m) => ({key: m.key, label: m.label})),
            onChange: (k: string) => {
              active.value = k
              const item = MENU.find((m) => m.key === k)
              if (item) showToast({type: item.type, message: item.msg, duration: 2800})
            }
          },
          {
            panel: ({item}: {item: {key: string}}) => {
              const m = MENU.find((x) => x.key === item.key)
              return h(
                'div',
                {
                  style:
                    'padding:16px;background:var(--m2m-pg-comp-bg-subtle);border-radius:8px;font-size:13px;color:var(--m2m-pg-comp-text-muted);min-height:60px'
                },
                `${m?.label} 탭: 탭 클릭 시 ${m?.type} 토스트가 발생합니다.`
              )
            }
          }
        )
      ])
  }
})
</script>

<template>
  <div>
    <ToastProvider :position="TOAST_POSITION['TOP_RIGHT']" :max-count="5" />
    <PageHeader
      title="Toast Popup"
      component="Toast"
      desc="— 사용자 알림 토스트 팝업 컴포넌트. 버튼 클릭 또는 이벤트 발생 시 화면에 띄웁니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'demo'"
          title="인터랙티브 Demo — 버튼 클릭으로 실제 Toast 발생"
          :code="[
            'import ToastProvider, {showToast} from \x27m2m-uiux-vue/Toast\x27',
            '',
            'const handleSave = async () => {',
            '  try {',
            '    await saveData()',
            '    showToast({ type: TOAST_TYPE[\x27SUCCESS\x27], message: \x27저장되었습니다.\x27, duration: 3000 })',
            '  } catch {',
            '    showToast({ type: TOAST_TYPE[\x27DANGER\x27], message: \x27저장에 실패했습니다.\x27 })',
            '  }',
            '}'
          ]"
          :notes="['화면 우측 상단에 실제 Toast 표시', '3초 후 자동 사라짐, X 버튼으로 즉시 닫기 가능']"
        >
          <ClickDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'tab-trigger'"
          title="탭 클릭 → Toast — 메뉴 탭 전환 시 토스트 발생"
          :code="[
            'import {showToast, TOAST_TYPE} from \x27m2m-uiux-vue/Toast\x27',
            '',
            'const handleTabChange = (key) => {',
            '  activeTab.value = key',
            '  if (key === \x27settings\x27) showToast({ type: TOAST_TYPE[\x27INFO\x27], message: \x27설정 페이지로 이동했습니다.\x27 })',
            '  if (key === \x27delete\x27) showToast({ type: TOAST_TYPE[\x27WARNING\x27], message: \x27삭제 모드입니다. 주의하세요.\x27 })',
            '}'
          ]"
          :notes="['탭을 클릭할 때마다 해당 타입의 Toast 가 발생', '페이지 이동·모드 전환 등 상황에 맞게 활용']"
        >
          <TabToastDemo />
        </ComponentSection>

        <template v-else-if="tab === 'type'">
          <ComponentSection
            v-for="tk in TYPE_KEYS"
            :key="tk"
            :title="`type=&quot;${TOAST_TYPE[tk]}&quot;`"
            :code="[
              `import ToastProvider, {showToast, TOAST_TYPE} from \x27m2m-uiux-vue/Toast\x27`,
              '',
              `showToast({ type: TOAST_TYPE[\x27${tk}\x27], message: &quot;${TYPE_LABEL[TOAST_TYPE[tk]]} 메시지입니다.&quot; })`
            ]"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              @click="showToast({type: TOAST_TYPE[tk], message: `${TYPE_LABEL[TOAST_TYPE[tk]]} 메시지입니다.`})"
            >
              {{ TOAST_TYPE[tk] }} 토스트 띄우기
            </Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'position'">
          <ComponentSection
            v-for="pk in POSITION_KEYS"
            :key="pk"
            :title="`position=&quot;${TOAST_POSITION[pk]}&quot;`"
            :code="[
              `import ToastProvider, {showToast, TOAST_TYPE, TOAST_POSITION} from \x27m2m-uiux-vue/Toast\x27`,
              '',
              `showToast({ type: TOAST_TYPE[\x27SUCCESS\x27], message: &quot;완료&quot;, position: TOAST_POSITION[\x27${pk}\x27] })`
            ]"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              :variant="BUTTON_VARIANT['GHOST']"
              @click="
                showToast({
                  type: TOAST_TYPE['SUCCESS'],
                  message: `${TOAST_POSITION[pk]} 위치!`,
                  position: TOAST_POSITION[pk],
                  duration: 2000
                })
              "
            >
              {{ TOAST_POSITION[pk] }}
            </Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'dismissible'">
          <ComponentSection
            title="dismissible={true} (기본) — X 닫기 버튼"
            :code="[
              'import {showToast} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, dismissible: true })'
            ]"
          >
            <Button :size="BUTTON_SIZE['SM']" @click="showToast({message: 'X 버튼 있음', duration: Infinity})"
              >dismissible: true</Button
            >
          </ComponentSection>
          <ComponentSection
            title="dismissible={false} — X 버튼 숨김"
            :code="[
              'import {showToast} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, dismissible: false })'
            ]"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              :variant="BUTTON_VARIANT['GHOST']"
              @click="showToast({message: 'X 버튼 없음 (2초 후 자동)', dismissible: false, duration: 2000})"
            >
              dismissible: false
            </Button>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'duration'">
          <ComponentSection
            title="duration — 자동 닫힘 (ms)"
            :code="[
              'import {showToast} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, duration: 1000 })'
            ]"
          >
            <Button :size="BUTTON_SIZE['SM']" @click="showToast({message: '1초 후 사라짐', duration: 1000})"
              >duration 1000</Button
            >
          </ComponentSection>
          <ComponentSection
            title="duration Infinity — 자동으로 닫히지 않음"
            :code="[
              'import {showToast} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, duration: Infinity })'
            ]"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              :variant="BUTTON_VARIANT['GHOST']"
              @click="
                showToast({type: TOAST_TYPE['WARNING'], message: '자동으로 닫히지 않음 (X 클릭)', duration: Infinity})
              "
            >
              duration Infinity
            </Button>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'action'"
          title="action — 액션 버튼"
          :code="[
            'import {showToast} from \x27m2m-uiux-vue/Toast\x27',
            '',
            'showToast({',
            '  message: \x27파일이 삭제되었습니다.\x27,',
            '  action: { label: \x27실행 취소\x27, onClick: () => restore() },',
            '})'
          ]"
          :notes="['action.onClick 실행 후 토스트가 자동으로 닫힙니다']"
        >
          <Button
            :size="BUTTON_SIZE['SM']"
            @click="
              showToast({
                type: TOAST_TYPE['INFO'],
                message: '파일이 삭제되었습니다.',
                duration: 5000,
                action: {label: '실행 취소', onClick: () => showToast({type: TOAST_TYPE['SUCCESS'], message: '복원됨'})}
              })
            "
          >
            실행 취소 포함
          </Button>
        </ComponentSection>

        <template v-else-if="tab === 'variant'">
          <ComponentSection
            title='variant="filled" (기본)'
            :code="[
              'import {showToast, TOAST_VARIANT} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, variant: TOAST_VARIANT[\x27FILLED\x27] })'
            ]"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              @click="showToast({type: TOAST_TYPE['SUCCESS'], message: 'filled', variant: 'filled'})"
              >filled</Button
            >
          </ComponentSection>
          <ComponentSection
            title='variant="light" — 흰 배경 + 컬러 보더'
            :code="[
              'import {showToast, TOAST_VARIANT} from \x27m2m-uiux-vue/Toast\x27',
              '',
              'showToast({ message: &quot;저장되었습니다.&quot;, variant: TOAST_VARIANT[\x27LIGHT\x27] })'
            ]"
            :notes="['light = 흰 배경 + 컬러 보더 (좌측 4px 강조)']"
          >
            <Button
              :size="BUTTON_SIZE['SM']"
              :variant="BUTTON_VARIANT['GHOST']"
              @click="showToast({type: TOAST_TYPE['SUCCESS'], message: 'light', variant: 'light'})"
            >
              light
            </Button>
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'usage'"
          title="설정 — ToastProvider"
          :code="[
            '&lt;!-- App.vue --&gt;',
            '<script setup lang=&quot;ts&quot;>',
            'import ToastProvider, {TOAST_POSITION} from \x27m2m-uiux-vue/Toast\x27',
            '<\/script>',
            '',
            '<template>',
            '  <ToastProvider :position=&quot;TOAST_POSITION[\x27TOP_RIGHT\x27]&quot; :max-count=&quot;5&quot;>',
            '    <App />',
            '  </ToastProvider>',
            '</template>'
          ]"
        >
          <span class="demo-hint">앱 최상단에 한 번만 배치하면 됩니다.</span>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
