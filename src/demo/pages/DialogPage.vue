<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'

import Button, {BUTTON_VARIANT} from '~/components/Button'
import {
  Dialog,
  DialogProvider,
  DIALOG_DIRECTION,
  DIALOG_SIZE,
  DIALOG_TONE,
  DIALOG_VARIANT,
  alertDialog,
  confirmDialog,
  openDialog
} from '~/components/Dialog'
import type {DialogDirection, DialogSize} from '~/components/Dialog'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = [
  'declarative',
  'size',
  'drawer',
  'direction',
  'swipeToClose',
  'lockScroll',
  'a11y',
  'openDialog',
  'confirm',
  'alert'
]

const DeclarativeDemo = defineComponent({
  name: 'DialogDeclarativeDemo',
  props: {size: {type: String as () => DialogSize, default: undefined}},
  setup(p) {
    const open = ref(false)
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => '다이얼로그 열기'),
      h(
        Dialog,
        {
          open: open.value,
          title: '회원 삭제',
          description: '이 작업은 되돌릴 수 없습니다.',
          size: p.size,
          onClose: () => (open.value = false)
        },
        {
          default: () => '정말 이 회원을 삭제하시겠어요? 관련 데이터가 모두 제거됩니다.',
          footer: () => [
            h(Button, {variant: BUTTON_VARIANT['GHOST'], onClick: () => (open.value = false)}, () => '취소'),
            h(Button, {variant: BUTTON_VARIANT['SECONDARY'], onClick: () => (open.value = false)}, () => '삭제')
          ]
        }
      )
    ]
  }
})

const DrawerDemo = defineComponent({
  name: 'DialogDrawerDemo',
  props: {
    direction: {type: String as () => DialogDirection, default: 'bottom'},
    swipeToClose: {type: Boolean, default: undefined},
    handle: {type: Boolean, default: undefined},
    lockScroll: {type: Boolean, default: undefined}
  },
  setup(p) {
    const open = ref(false)
    return () => [
      h(Button, {onClick: () => (open.value = true)}, () => `drawer 열기 (${p.direction})`),
      h(
        Dialog,
        {
          open: open.value,
          variant: DIALOG_VARIANT['DRAWER'],
          direction: p.direction,
          swipeToClose: p.swipeToClose,
          handle: p.handle,
          lockScroll: p.lockScroll,
          title: '빠른 필터',
          description: '헤더 또는 핸들을 방향 반대로 스와이프하면 닫힙니다.',
          onClose: () => (open.value = false)
        },
        {
          default: () =>
            h('div', {style: {display: 'grid', gap: '8px'}}, [
              h('p', '여기에 폼/리스트 등 임의 콘텐츠를 넣습니다.'),
              h(
                'p',
                {style: {color: 'var(--m2m-pg-comp-text-muted)'}},
                '드래그하는 동안 오버레이가 점점 투명해지고, 임계값(closeThreshold, 기본 0.45)을 넘기면 닫힙니다.'
              )
            ]),
          footer: () =>
            h(Button, {variant: BUTTON_VARIANT['SECONDARY'], onClick: () => (open.value = false)}, () => '적용')
        }
      )
    ]
  }
})

const ImperativeDemo = defineComponent({
  name: 'DialogImperativeDemo',
  props: {kind: {type: String as () => 'open' | 'confirm' | 'alert', required: true}},
  setup(p) {
    const log = ref('(없음)')
    const trigger = () => {
      if (p.kind === 'open')
        return h(
          Button,
          {
            onClick: () =>
              openDialog({
                title: '프로필',
                content: h('div', [
                  h('p', '임의 콘텐츠를 넣을 수 있습니다.'),
                  h('p', {style: {color: 'var(--m2m-pg-comp-text-muted)'}}, 'openDialog() 는 id 를 반환합니다.')
                ]),
                size: DIALOG_SIZE['MD']
              })
          },
          () => 'openDialog'
        )
      if (p.kind === 'confirm')
        return h(
          Button,
          {
            variant: BUTTON_VARIANT['SECONDARY'],
            onClick: async () => {
              const ok = await confirmDialog({
                title: '삭제 확인',
                message: '3개 항목을 삭제할까요?',
                tone: DIALOG_TONE['DANGER'],
                confirmText: '삭제'
              })
              log.value = `confirm → ${ok}`
            }
          },
          () => 'confirmDialog'
        )
      return h(
        Button,
        {
          variant: BUTTON_VARIANT['GHOST'],
          onClick: async () => {
            await alertDialog({title: '알림', message: '저장되었습니다.'})
            log.value = 'alert → 확인됨'
          }
        },
        () => 'alertDialog'
      )
    }
    return () =>
      h(DialogProvider, null, {
        default: () =>
          h('div', {class: 'demo-col'}, [
            h('div', {class: 'demo-row', style: {gap: '8px', flexWrap: 'wrap'}}, [trigger()]),
            p.kind === 'open' ? null : h('span', {class: 'demo-hint'}, `결과: ${log.value}`)
          ])
      })
  }
})

// 데모/코드예시 모두 하드코딩 문자열 대신 export 상수(DIALOG_SIZE · DIALOG_DIRECTION) 키로 관리
const SIZES: (keyof typeof DIALOG_SIZE)[] = ['SM', 'MD', 'LG', 'FULL']
const DIRECTIONS: (keyof typeof DIALOG_DIRECTION)[] = ['BOTTOM', 'TOP', 'LEFT', 'RIGHT']
</script>

<template>
  <div>
    <PageHeader
      title="Dialog"
      component="Dialog"
      desc="— 모달/드로어. 선언형 <Dialog open @close> + 명령형 openDialog / confirmDialog / alertDialog."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <!-- ─────────── declarative ─────────── -->
        <ComponentSection
          v-if="tab === 'declarative'"
          title="선언형 — <Dialog open @close>"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27`,
            'import Dialog from \x27m2m-uiux-vue/Dialog\x27',
            '',
            'const open = ref(false)',
            '</script>',
            '',
            '<template>',
            '  <Button @click=&quot;open = true&quot;>다이얼로그 열기</Button>',
            '  <Dialog',
            '    :open=&quot;open&quot;',
            '    @close=&quot;open = false&quot;',
            '    title=&quot;회원 삭제&quot;',
            '    description=&quot;이 작업은 되돌릴 수 없습니다.&quot;',
            '  >',
            '    정말 이 회원을 삭제하시겠어요?',
            '    <template #footer>',
            '      <Button :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot; @click=&quot;open = false&quot;>취소</Button>',
            '      <Button :variant=&quot;BUTTON_VARIANT[\x27SECONDARY\x27]&quot; @click=&quot;open = false&quot;>삭제</Button>',
            '    </template>',
            '  </Dialog>',
            '</template>'
          ]"
          :notes="['backdrop 클릭 · ESC · X 버튼으로 close', '스크롤 잠금 자동']"
        >
          <DeclarativeDemo />
        </ComponentSection>

        <!-- ─────────── size ─────────── -->
        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${DIALOG_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Dialog, {DIALOG_SIZE} from \x27m2m-uiux-vue/Dialog\x27`,
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              `  <Dialog :open=&quot;open&quot; @close=&quot;open = false&quot; :size=&quot;DIALOG_SIZE[\x27${s}\x27]&quot; title=&quot;제목&quot;>본문</Dialog>`,
              '</template>'
            ]"
          >
            <DeclarativeDemo :size="DIALOG_SIZE[s]" />
          </ComponentSection>
        </template>

        <!-- ─────────── drawer ─────────── -->
        <ComponentSection
          v-else-if="tab === 'drawer'"
          title='variant="drawer" — 아래에서 올라오는 패널'
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            `import Dialog, {DIALOG_VARIANT, DIALOG_DIRECTION} from \x27m2m-uiux-vue/Dialog\x27`,
            '',
            'const open = ref(false)',
            '</script>',
            '',
            '<template>',
            '  <Dialog',
            '    :open=&quot;open&quot;',
            '    @close=&quot;open = false&quot;',
            '    :variant=&quot;DIALOG_VARIANT[\x27DRAWER\x27]&quot;',
            '    :direction=&quot;DIALOG_DIRECTION[\x27BOTTOM\x27]&quot;',
            '    title=&quot;빠른 필터&quot;',
            '  >',
            '    본문',
            '  </Dialog>',
            '</template>'
          ]"
          :notes="[
            'variant 로 기존 모달과 동일한 컴포넌트에서 형태만 전환 (새 컴포넌트 아님)',
            '진입/이탈은 cubic-bezier(.22,1,.36,1) 감속으로 미끄러짐',
            'handle(상단 grab 바)은 기본 표시, :handle=&quot;false&quot; 로 숨김'
          ]"
        >
          <DrawerDemo :direction="DIALOG_DIRECTION['BOTTOM']" />
        </ComponentSection>

        <!-- ─────────── direction ─────────── -->
        <template v-else-if="tab === 'direction'">
          <ComponentSection
            v-for="s in DIRECTIONS"
            :key="s"
            :title="`direction=&quot;${DIALOG_DIRECTION[s]}&quot;${s === 'BOTTOM' ? ' (기본)' : ''}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Dialog, {DIALOG_VARIANT, DIALOG_DIRECTION} from \x27m2m-uiux-vue/Dialog\x27`,
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              `  <Dialog :open=&quot;open&quot; @close=&quot;open = false&quot; :variant=&quot;DIALOG_VARIANT[\x27DRAWER\x27]&quot; :direction=&quot;DIALOG_DIRECTION[\x27${s}\x27]&quot; title=&quot;제목&quot;>본문</Dialog>`,
              '</template>'
            ]"
            :notes="
              s === 'LEFT' || s === 'RIGHT'
                ? ['left/right 폭은 size 로 조정 (sm 320 / md 420 / lg 560 / full 100%)']
                : ['top/bottom 은 가로 전체 폭']
            "
          >
            <DrawerDemo :direction="DIALOG_DIRECTION[s]" />
          </ComponentSection>
        </template>

        <!-- ─────────── swipeToClose ─────────── -->
        <template v-else-if="tab === 'swipeToClose'">
          <ComponentSection
            title="swipeToClose — 등장 방향의 반대로 스와이프하면 닫힘 (기본 true)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Dialog, {DIALOG_VARIANT, DIALOG_DIRECTION} from \x27m2m-uiux-vue/Dialog\x27`,
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              '  <Dialog',
              '    :open=&quot;open&quot;',
              '    @close=&quot;open = false&quot;',
              '    :variant=&quot;DIALOG_VARIANT[\x27DRAWER\x27]&quot;',
              '    :direction=&quot;DIALOG_DIRECTION[\x27BOTTOM\x27]&quot;',
              '    swipe-to-close',
              '    :close-threshold=&quot;0.45&quot;',
              '    title=&quot;제목&quot;',
              '  >본문</Dialog>',
              '</template>'
            ]"
            :notes="[
              '헤더 전체(100%) 또는 핸들에서 드래그 → 패널이 커서를 따라 이동',
              '드래그 진행도만큼 오버레이 opacity 가 낮아짐 (움직임에 따라 투명 → 사라짐)',
              'closeThreshold(패널 길이 대비 비율) 초과 시 닫힘, 미만이면 원위치로 스프링백'
            ]"
          >
            <DrawerDemo :direction="DIALOG_DIRECTION['BOTTOM']" :swipe-to-close="true" />
          </ComponentSection>
          <ComponentSection
            title=':swipe-to-close="false" — 스와이프 비활성'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Dialog, {DIALOG_VARIANT, DIALOG_DIRECTION} from \x27m2m-uiux-vue/Dialog\x27`,
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              '  <Dialog',
              '    :open=&quot;open&quot;',
              '    @close=&quot;open = false&quot;',
              '    :variant=&quot;DIALOG_VARIANT[\x27DRAWER\x27]&quot;',
              '    :direction=&quot;DIALOG_DIRECTION[\x27RIGHT\x27]&quot;',
              '    :swipe-to-close=&quot;false&quot;',
              '    title=&quot;제목&quot;',
              '  >본문</Dialog>',
              '</template>'
            ]"
          >
            <DrawerDemo :direction="DIALOG_DIRECTION['RIGHT']" :swipe-to-close="false" />
          </ComponentSection>
        </template>

        <!-- ─────────── lockScroll ─────────── -->
        <template v-else-if="tab === 'lockScroll'">
          <ComponentSection
            title="lockScroll (기본 true) — 열려 있는 동안 body 스크롤 잠금"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Dialog from \x27m2m-uiux-vue/Dialog\x27',
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              '  <Dialog :open=&quot;open&quot; @close=&quot;open = false&quot; lock-scroll title=&quot;제목&quot;>본문</Dialog>',
              '</template>'
            ]"
            :notes="[
              '모달이 떠 있을 때 뒤 페이지 스크롤이 조작되지 않습니다',
              '열리기 전에 스크롤바를 먼저 없애고(패딩 보정) 진입 애니메이션을 시작 → 패널 폭/높이 튐 방지',
              '닫힐 때는 애니메이션이 끝난 뒤 스크롤 복원',
              '여러 다이얼로그가 열려도 잠금 유지, 마지막이 닫힐 때 해제'
            ]"
          >
            <DeclarativeDemo />
          </ComponentSection>
          <ComponentSection
            title=':lock-scroll="false" — 뒤 스크롤 허용'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              `import Dialog, {DIALOG_VARIANT, DIALOG_DIRECTION} from \x27m2m-uiux-vue/Dialog\x27`,
              '',
              'const open = ref(false)',
              '</script>',
              '',
              '<template>',
              '  <Dialog',
              '    :open=&quot;open&quot;',
              '    @close=&quot;open = false&quot;',
              '    :variant=&quot;DIALOG_VARIANT[\x27DRAWER\x27]&quot;',
              '    :direction=&quot;DIALOG_DIRECTION[\x27BOTTOM\x27]&quot;',
              '    :lock-scroll=&quot;false&quot;',
              '    title=&quot;제목&quot;',
              '  >본문</Dialog>',
              '</template>'
            ]"
          >
            <DrawerDemo :direction="DIALOG_DIRECTION['BOTTOM']" :lock-scroll="false" />
          </ComponentSection>
        </template>

        <!-- ─────────── a11y ─────────── -->
        <ComponentSection
          v-else-if="tab === 'a11y'"
          title="접근성 — 포커스 트랩 · 복원"
          :code="[
            '// 별도 설정 없이 기본 동작',
            '// 1) 열리면 포커스가 패널로 이동',
            '// 2) Tab / Shift+Tab 이 패널 안에서만 순환',
            '// 3) 닫히면 열기 직전 요소로 포커스 복원',
            '// 4) role=&quot;dialog&quot; aria-modal=&quot;true&quot;, ESC 로 닫기'
          ]"
          :notes="['footer 버튼까지 논리적 탭 순서 유지', 'title 이 없으면 ariaLabel 로 이름 제공']"
        >
          <DeclarativeDemo />
        </ComponentSection>

        <!-- ─────────── openDialog ─────────── -->
        <ComponentSection
          v-else-if="tab === 'openDialog'"
          title="openDialog — 임의 콘텐츠 모달"
          :code="[
            'import {h} from \x27vue\x27',
            'import {DialogProvider, openDialog, closeDialog, DIALOG_SIZE} from \x27m2m-uiux-vue/Dialog\x27',
            '',
            '// 1) 앱 최상단을 Provider 로 한 번 감싼다',
            '//    <DialogProvider><App /></DialogProvider>',
            '',
            '// 2) 어디서든 명령형으로 호출',
            'const id = openDialog({',
            '  title: \x27상세\x27,',
            '  content: h(\x27p\x27, \x27임의 콘텐츠\x27),',
            '  size: DIALOG_SIZE[\x27LG\x27],',
            '})',
            'closeDialog(id)'
          ]"
        >
          <ImperativeDemo kind="open" />
        </ComponentSection>

        <!-- ─────────── confirm ─────────── -->
        <ComponentSection
          v-else-if="tab === 'confirm'"
          title="confirmDialog — Promise<boolean>"
          :code="[
            'import {confirmDialog, DIALOG_TONE} from \x27m2m-uiux-vue/Dialog\x27',
            '',
            'const ok = await confirmDialog({',
            '  title: \x27삭제 확인\x27,',
            '  message: \x273개 항목을 삭제할까요?\x27,',
            '  tone: DIALOG_TONE[\x27DANGER\x27],',
            '  confirmText: \x27삭제\x27,',
            '})',
            'if (ok) await remove()'
          ]"
          :notes="['확인 → true, 취소·ESC → false', 'tone=DIALOG_TONE[\x27DANGER\x27] → 확인 버튼 빨강']"
        >
          <ImperativeDemo kind="confirm" />
        </ComponentSection>

        <!-- ─────────── alert ─────────── -->
        <ComponentSection
          v-else-if="tab === 'alert'"
          title="alertDialog — Promise<void>"
          :code="[
            'import {alertDialog} from \x27m2m-uiux-vue/Dialog\x27',
            '',
            'await alertDialog({ title: \x27알림\x27, message: \x27저장되었습니다.\x27 })'
          ]"
          :notes="['확인 버튼 1개, X 없음', 'title 을 주면 헤더 타이틀이 표시됨 (생략 시 본문만)']"
        >
          <ImperativeDemo kind="alert" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
