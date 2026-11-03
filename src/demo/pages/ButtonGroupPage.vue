<script setup lang="ts">
import Button, {BUTTON_VARIANT} from '~/components/Button'
import ButtonGroup, {BUTTON_GROUP_DIRECTION, BUTTON_GROUP_SIZE} from '~/components/ButtonGroup'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['direction', 'attached', 'size', 'disabled']

// 데모/코드예시 모두 하드코딩 문자열 대신 export 상수(BUTTON_GROUP_SIZE 등) 키로 관리
const SIZE_ROWS: {k: keyof typeof BUTTON_GROUP_SIZE; suffix: string}[] = [
  {k: 'LG', suffix: ' — 하위 버튼 일괄 크기 적용'},
  {k: 'MD', suffix: ' (기본)'},
  {k: 'SM', suffix: ''}
]
const SIZES: (keyof typeof BUTTON_GROUP_SIZE)[] = ['LG', 'MD', 'SM']
</script>

<template>
  <div>
    <PageHeader
      title="ButtonGroup"
      component="ButtonGroup"
      desc="— 버튼 묶음 컴포넌트. 여러 버튼을 하나의 그룹으로 관리합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'direction'">
          <ComponentSection
            title='direction="row" (기본) — 가로 나열'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_DIRECTION} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :direction=&quot;BUTTON_GROUP_DIRECTION[\x27ROW\x27]&quot;>',
              '    <Button>이전</Button>',
              '    <Button>현재</Button>',
              '    <Button>다음</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
            :notes="['direction 기본값은 row (가로 나열)']"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['ROW']">
              <Button>이전</Button>
              <Button>현재</Button>
              <Button>다음</Button>
            </ButtonGroup>
          </ComponentSection>

          <ComponentSection
            title='direction="column" — 세로 쌓기'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_DIRECTION} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :direction=&quot;BUTTON_GROUP_DIRECTION[\x27COLUMN\x27]&quot;>',
              '    <Button>저장</Button>',
              '    <Button :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot;>취소</Button>',
              '    <Button :variant=&quot;BUTTON_VARIANT[\x27SECONDARY\x27]&quot;>삭제</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['COLUMN']">
              <Button>저장</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']">취소</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']">삭제</Button>
            </ButtonGroup>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'attached'">
          <ComponentSection
            title="attached={true} — 버튼 사이 여백 없이 붙임 (row)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_DIRECTION} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :direction=&quot;BUTTON_GROUP_DIRECTION[\x27ROW\x27]&quot; attached>',
              '    <Button>1일</Button>',
              '    <Button>1주</Button>',
              '    <Button>1달</Button>',
              '    <Button>3달</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
            :notes="['attached 모드에서는 경계 버튼의 border-radius 가 자동 조정됨']"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['ROW']" attached>
              <Button>1일</Button>
              <Button>1주</Button>
              <Button>1달</Button>
              <Button>3달</Button>
            </ButtonGroup>
          </ComponentSection>

          <ComponentSection
            title="attached={true} — 세로 붙임 (column)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_DIRECTION} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :direction=&quot;BUTTON_GROUP_DIRECTION[\x27COLUMN\x27]&quot; attached>',
              '    <Button>전체</Button>',
              '    <Button>진행 중</Button>',
              '    <Button>완료</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['COLUMN']" attached>
              <Button>전체</Button>
              <Button>진행 중</Button>
              <Button>완료</Button>
            </ButtonGroup>
          </ComponentSection>

          <ComponentSection
            title="attached={false} (기본) — 여백 있음"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup>',
              '    <Button>확인</Button>',
              '    <Button :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot;>취소</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['ROW']" :attached="false">
              <Button>확인</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']">취소</Button>
            </ButtonGroup>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="{k, suffix} in SIZE_ROWS"
            :key="k"
            :title="`size=&quot;${BUTTON_GROUP_SIZE[k]}&quot;${suffix}`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_SIZE} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              `  <ButtonGroup :size=&quot;BUTTON_GROUP_SIZE[\x27${k}\x27]&quot;>`,
              '    <Button>확인</Button>',
              '    <Button>취소</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
            :notes="k === 'LG' ? ['size 는 그룹 내 모든 버튼에 일괄 적용됨', '개별 버튼의 size 는 무시됨'] : undefined"
          >
            <ButtonGroup :size="BUTTON_GROUP_SIZE[k]">
              <Button>확인</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']">취소</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']">삭제</Button>
            </ButtonGroup>
          </ComponentSection>
          <ComponentSection
            title="size — attached 와 조합"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_SIZE} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup attached :size=&quot;BUTTON_GROUP_SIZE[\x27LG\x27]&quot;>…</ButtonGroup>',
              '  <ButtonGroup attached :size=&quot;BUTTON_GROUP_SIZE[\x27MD\x27]&quot;>…</ButtonGroup>',
              '  <ButtonGroup attached :size=&quot;BUTTON_GROUP_SIZE[\x27SM\x27]&quot;>…</ButtonGroup>',
              '</template>'
            ]"
          >
            <div style="display: flex; flex-direction: column; gap: 14px">
              <ButtonGroup
                v-for="s in SIZES"
                :key="s"
                :direction="BUTTON_GROUP_DIRECTION['ROW']"
                attached
                :size="BUTTON_GROUP_SIZE[s]"
              >
                <Button>{{ BUTTON_GROUP_SIZE[s] }} A</Button>
                <Button>{{ BUTTON_GROUP_SIZE[s] }} B</Button>
                <Button>{{ BUTTON_GROUP_SIZE[s] }} C</Button>
              </ButtonGroup>
            </div>
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled={true} — 그룹 전체 비활성화"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :disabled=&quot;true&quot;>',
              '    <Button>저장</Button>',
              '    <Button :variant=&quot;BUTTON_VARIANT[\x27GHOST\x27]&quot;>미리보기</Button>',
              '    <Button :variant=&quot;BUTTON_VARIANT[\x27SECONDARY\x27]&quot;>삭제</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
            :notes="['그룹에 disabled 지정 시 하위 버튼 전체에 일괄 적용됨']"
          >
            <ButtonGroup disabled>
              <Button>저장</Button>
              <Button :variant="BUTTON_VARIANT['GHOST']">미리보기</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']">삭제</Button>
            </ButtonGroup>
          </ComponentSection>

          <ComponentSection
            title="disabled — 개별 버튼 비활성화"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup>',
              '    <Button>활성</Button>',
              '    <Button disabled>비활성</Button>',
              '    <Button>활성</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
            :notes="['그룹 disabled 가 false 여도 개별 버튼에 disabled 지정 가능']"
          >
            <ButtonGroup>
              <Button>활성</Button>
              <Button disabled>비활성</Button>
              <Button>활성</Button>
            </ButtonGroup>
          </ComponentSection>

          <ComponentSection
            title="disabled={true} — attached + disabled 조합"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Button from \x27m2m-uiux-vue/Button\x27',
              'import ButtonGroup, {BUTTON_GROUP_DIRECTION} from \x27m2m-uiux-vue/ButtonGroup\x27',
              '</script>',
              '',
              '<template>',
              '  <ButtonGroup :direction=&quot;BUTTON_GROUP_DIRECTION[\x27ROW\x27]&quot; attached disabled>',
              '    <Button>전체</Button>',
              '    <Button>진행 중</Button>',
              '    <Button>완료</Button>',
              '  </ButtonGroup>',
              '</template>'
            ]"
          >
            <ButtonGroup :direction="BUTTON_GROUP_DIRECTION['ROW']" attached disabled>
              <Button>전체</Button>
              <Button>진행 중</Button>
              <Button>완료</Button>
            </ButtonGroup>
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
