<script setup lang="ts">
import {reactive, ref} from 'vue'

import Button, {BUTTON_VARIANT} from '~/components/Button'
import Form, {FORM_ACTIONS_ALIGN, FORM_LAYOUT} from '~/components/Form'
import Input from '~/components/Input'
import Select from '~/components/Select'
import Textarea from '~/components/Textarea'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = [
  'vertical',
  'horizontal',
  '2column',
  'searchbar',
  'range',
  'inline-multi',
  'multi-button',
  'validation',
  'readonly'
]

const DEPT = [
  {label: '개발팀', value: 'dev'},
  {label: '디자인팀', value: 'design'},
  {label: '기획팀', value: 'plan'},
  {label: '마케팅팀', value: 'mkt'}
]

const CONDITION = [
  {label: '이름', value: 'name'},
  {label: '이메일', value: 'email'}
]
const CATEGORY = [
  {label: '공지사항', value: 'notice'},
  {label: '이벤트', value: 'event'},
  {label: '업데이트', value: 'update'},
  {label: '기타', value: 'etc'}
]
const UNIT = [
  {label: '개', value: 'ea'},
  {label: '박스', value: 'box'},
  {label: 'kg', value: 'kg'},
  {label: 'm', value: 'm'},
  {label: 'L', value: 'l'}
]

const status = ref('')

const vform = reactive({name: '', email: '', pw: ''})
const errors = reactive<Record<string, string>>({})
function validate(e: Event) {
  e.preventDefault()
  const next: Record<string, string> = {}
  if (!vform.name.trim()) next.name = '이름을 입력해주세요.'
  if (!vform.email.includes('@')) next.email = '올바른 이메일 형식이 아닙니다.'
  if (vform.pw.length < 8) next.pw = '비밀번호는 8자 이상이어야 합니다.'
  errors.name = next.name ?? ''
  errors.email = next.email ?? ''
  errors.pw = next.pw ?? ''
}

const CODE: Record<string, string[]> = {
  vertical: [
    '<script setup lang="ts">',
    `import Form, {FORM_LAYOUT, FORM_ACTIONS_ALIGN} from \x27m2m-uiux-vue/Form\x27`,
    `import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27`,
    `import Input from \x27m2m-uiux-vue/Input\x27`,
    `import Select from \x27m2m-uiux-vue/Select\x27`,
    '',
    'function handleSubmit(e: Event) {',
    '  e.preventDefault()',
    '}',
    '<\/script>',
    '',
    '<template>',
    '  <Form :layout="FORM_LAYOUT[\x27VERTICAL\x27]" @submit="handleSubmit">',
    '    <Form.Field name="name" label="이름" required>',
    '      <Input.Text placeholder="홍길동" />',
    '    </Form.Field>',
    '    <Form.Field name="email" label="이메일" required>',
    '      <Input.Email />',
    '    </Form.Field>',
    '    <Form.Field name="dept" label="부서">',
    '      <Select :options="deptOptions" />',
    '    </Form.Field>',
    '    <Form.Actions :align="FORM_ACTIONS_ALIGN[\x27BETWEEN\x27]">',
    '      <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]" full-width>취소</Button>',
    '      <Button html-type="submit" full-width>저장</Button>',
    '    </Form.Actions>',
    '  </Form>',
    '</template>'
  ],
  horizontal: [
    '<script setup lang="ts">',
    `import Form, {FORM_LAYOUT} from \x27m2m-uiux-vue/Form\x27`,
    `import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27`,
    `import Input from \x27m2m-uiux-vue/Input\x27`,
    '<\/script>',
    '',
    '<template>',
    '  <Form :layout="FORM_LAYOUT[\x27HORIZONTAL\x27]" :label-width="80" @submit="handleSubmit">',
    '    <Form.Field name="name" label="이름" required>',
    '      <Input.Text />',
    '    </Form.Field>',
    '    <Form.Actions>',
    '      <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">취소</Button>',
    '      <Button html-type="submit">저장</Button>',
    '    </Form.Actions>',
    '  </Form>',
    '</template>'
  ],
  '2column': [
    '<script setup lang="ts">',
    `import Form from \x27m2m-uiux-vue/Form\x27`,
    `import Input from \x27m2m-uiux-vue/Input\x27`,
    '<\/script>',
    '',
    '<template>',
    '  <Form>',
    '    &lt;!-- 2컬럼 그리드 내부에 폼 필드 배치 --&gt;',
    '    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">',
    '      <Form.Field label="성" required><Input.Text placeholder="홍" /></Form.Field>',
    '      <Form.Field label="이름" required><Input.Text placeholder="길동" /></Form.Field>',
    '    </div>',
    '    &lt;!-- 풀너비 필드 --&gt;',
    '    <Form.Field label="주소"><Input.Text /></Form.Field>',
    '  </Form>',
    '</template>'
  ],
  searchbar: [
    '<script setup lang="ts">',
    'import Form, {FORM_LAYOUT} from \x27m2m-uiux-vue/Form\x27',
    'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
    'import Input from \x27m2m-uiux-vue/Input\x27',
    'import Select from \x27m2m-uiux-vue/Select\x27',
    '<\/script>',
    '',
    '<template>',
    '  <Form>',
    '    <!-- 인라인 필드는 같은 폼 안에서 라벨 열을 공유 → 가장 긴 라벨 기준으로 컨트롤 정렬 -->',
    '    <Form.Field label="검색어" :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--search"> <!-- grid-template-columns: 1fr auto -->',
    '        <Input.Search placeholder="검색어를 입력해주세요" />',
    '        <Button html-type="submit">검색</Button>',
    '      </div>',
    '    </Form.Field>',
    '    <Form.Field label="사번" :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--id"> <!-- 1fr auto auto -->',
    '        <Input.Text placeholder="EMP-0000" />',
    '        <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">조회</Button>',
    '        <Button>확인</Button>',
    '      </div>',
    '    </Form.Field>',
    '    <Form.Field label="조건" :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--condition"> <!-- 120px 1fr auto -->',
    '        <Select :options="opts" />',
    '        <Input.Text placeholder="검색값" />',
    '        <Button>검색</Button>',
    '      </div>',
    '    </Form.Field>',
    '  </Form>',
    '</template>'
  ],
  range: [
    '<script setup lang="ts">',
    'import Form, {FORM_LAYOUT} from \x27m2m-uiux-vue/Form\x27',
    'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
    'import Input from \x27m2m-uiux-vue/Input\x27',
    '<\/script>',
    '',
    '<template>',
    '  <Form>',
    '    <!-- 모든 행이 같은 4열 그리드 (시작 | ~ | 종료 | 부가) → 세로로 정렬 -->',
    '    <!-- .row--range { display: grid; grid-template-columns: 1fr auto 1fr 168px; gap: 8px } -->',
    '    <Form.Field label="기간" required :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--range">',
    '        <Input.Text placeholder="YYYY-MM-DD" /> <span>~</span> <Input.Text placeholder="YYYY-MM-DD" />',
    '        <span>',
    '          <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">오늘</Button>',
    '          <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">이번 달</Button>',
    '        </span>',
    '      </div>',
    '    </Form.Field>',
    '    <Form.Field label="금액" :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--range">',
    '        <Input.Number placeholder="최소 금액" /> <span>~</span> <Input.Number placeholder="최대 금액" />',
    '        <span>원</span>',
    '      </div>',
    '    </Form.Field>',
    '  </Form>',
    '</template>'
  ],
  'inline-multi': [
    '<script setup lang="ts">',
    'import Form, {FORM_LAYOUT} from \x27m2m-uiux-vue/Form\x27',
    'import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27',
    'import Input from \x27m2m-uiux-vue/Input\x27',
    'import Select from \x27m2m-uiux-vue/Select\x27',
    '<\/script>',
    '',
    '<template>',
    '  <Form>',
    '    <!-- 전화번호 3분할: grid-template-columns: 1fr auto 1fr auto 1fr -->',
    '    <Form.Field label="전화번호" :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="row row--phone">',
    '        <Input.Text default-value="010" /> <span>-</span> <Input.Text /> <span>-</span> <Input.Text />',
    '      </div>',
    '    </Form.Field>',
    '    <!-- 주소: 우편번호 + 검색 버튼 (1fr auto) → 아래 입력은 전체 폭 -->',
    '    <Form.Field label="주소" required :layout="FORM_LAYOUT[\x27INLINE\x27]">',
    '      <div class="stack">',
    '        <div class="row row--zip">',
    '          <Input.Text placeholder="우편번호" />',
    '          <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">주소 검색</Button>',
    '        </div>',
    '        <Input.Text placeholder="기본 주소" />',
    '        <Input.Text placeholder="상세 주소 (동/호수)" />',
    '      </div>',
    '    </Form.Field>',
    '  </Form>',
    '</template>'
  ],
  'multi-button': [
    '<script setup lang="ts">',
    `import Form, {FORM_ACTIONS_ALIGN} from \x27m2m-uiux-vue/Form\x27`,
    `import Button, {BUTTON_VARIANT} from \x27m2m-uiux-vue/Button\x27`,
    '<\/script>',
    '',
    '<template>',
    '  <Form>',
    '    <Form.Actions :align="FORM_ACTIONS_ALIGN[\x27BETWEEN\x27]">',
    '      &lt;!-- 임시저장 — 보조 --&gt;',
    '      <Button :variant="BUTTON_VARIANT[\x27GHOST\x27]">임시저장</Button>',
    '      &lt;!-- 등록 — 주 액션 --&gt;',
    '      <Button html-type="submit">등록</Button>',
    '      &lt;!-- 삭제 — 위험 액션 --&gt;',
    '      <Button :variant="BUTTON_VARIANT[\x27SECONDARY\x27]">삭제</Button>',
    '    </Form.Actions>',
    '  </Form>',
    '</template>'
  ],
  validation: [
    '<script setup lang="ts">',
    'import {reactive} from \x27vue\x27',
    `import Form from \x27m2m-uiux-vue/Form\x27`,
    `import Button from \x27m2m-uiux-vue/Button\x27`,
    `import Input from \x27m2m-uiux-vue/Input\x27`,
    '',
    'const form = reactive({name: \x27\x27, email: \x27\x27})',
    'const errors = reactive<Record<string, string>>({})',
    '',
    'function validate(e: Event) {',
    '  e.preventDefault()',
    '  errors.name = form.name.trim() ? \x27\x27 : \x27이름을 입력해주세요.\x27',
    '  errors.email = form.email.includes(\x27@\x27) ? \x27\x27 : \x27올바른 이메일 형식이 아닙니다.\x27',
    '}',
    '<\/script>',
    '',
    '<template>',
    '  <Form no-validate @submit="validate">',
    '    <Form.Field label="이름" required :error="errors.name">',
    '      <Input.Text',
    '        :value="form.name"',
    '        :error="Boolean(errors.name)"',
    '        @change="form.name = ($event.target as HTMLInputElement).value"',
    '      />',
    '    </Form.Field>',
    '    <Form.Field label="이메일" required :error="errors.email">',
    '      <Input.Email',
    '        :value="form.email"',
    '        :error="Boolean(errors.email)"',
    '        @change="form.email = ($event.target as HTMLInputElement).value"',
    '      />',
    '    </Form.Field>',
    '    <Form.Actions>',
    '      <Button html-type="submit">검증하기</Button>',
    '    </Form.Actions>',
    '  </Form>',
    '</template>'
  ],
  readonly: [
    '<script setup lang="ts">',
    'import {ref} from \x27vue\x27',
    `import Form, {FORM_LAYOUT} from \x27m2m-uiux-vue/Form\x27`,
    `import Input from \x27m2m-uiux-vue/Input\x27`,
    '',
    'const mode = ref<\x27view\x27 | \x27edit\x27>(\x27view\x27)',
    'const data = {name: \x27홍길동\x27, dept: \x27개발팀\x27}',
    '<\/script>',
    '',
    '<template>',
    '  &lt;!-- readOnly — 복사 가능, 수정 불가 --&gt;',
    '  <Input.Text readonly :value="data.name" />',
    '  &lt;!-- disabled — 포커스 불가, 완전 잠금 --&gt;',
    '  <Input.Text disabled :value="data.dept" />',
    '  &lt;!-- Form 전체 잠금 (fieldset disabled) --&gt;',
    '  <Form disabled :layout="FORM_LAYOUT[\x27HORIZONTAL\x27]">',
    '    <Form.Field label="이름"><Input.Text :value="data.name" /></Form.Field>',
    '  </Form>',
    '  &lt;!-- 모드 전환 패턴 --&gt;',
    '  <Input.Text :readonly="mode === \x27view\x27" :value="data.name" />',
    '</template>'
  ]
}

const TITLE: Record<string, string> = {
  vertical: 'vertical — 세로 단일 컬럼 (기본 패턴)',
  horizontal: 'horizontal — 가로 배치, 라벨 우측 정렬',
  '2column': '2-column grid — 한 줄에 [라벨+인풋] [라벨+인풋]',
  searchbar: '검색 바 — 라벨 + 인풋 + 버튼(들)',
  range: '범위 입력 — [라벨] [시작값] ~ [종료값]',
  'inline-multi': '인라인 복합 — 한 줄에 여러 인풋 조합',
  'multi-button': '버튼 3개 — 임시저장 / 등록 / 삭제',
  validation: '유효성 검사 — 에러 메시지 인라인 표시',
  readonly: '조회 모드 — readOnly / disabled 상태'
}

const NOTES: Record<string, string[] | undefined> = {
  vertical: ['레이블이 인풋 위에 위치합니다 (기본값)', '모바일 친화적 레이아웃'],
  horizontal: ['라벨이 인풋 왼쪽에 위치합니다', 'labelWidth prop 으로 라벨 너비 지정'],
  '2column': ['CSS grid 로 2컬럼 구성', '풀너비가 필요한 필드는 grid 바깥에 배치'],
  searchbar: [
    '라벨 + 인풋 + 버튼을 한 줄에 배치하는 패턴',
    'inline 필드는 같은 폼 안에서 라벨 열을 공유 — 가장 긴 라벨 너비에 맞춰 모든 행의 컨트롤 좌우 끝이 정렬됩니다',
    '라벨은 줄바꿈되지 않습니다 (줄바꿈이 필요하면 라벨에 <br> 사용)'
  ],
  range: [
    '날짜·금액·시간 범위 모두 동일한 4열 그리드(시작 | ~ | 종료 | 부가)로 구성해 행마다 입력 칸 너비가 같고, 버튼은 인풋(40px) 높이에 맞춰 늘어납니다'
  ],
  'inline-multi': [
    '전화번호 분할, 주소 검색, 수량+단위 등 실무 패턴',
    '행마다 grid-template-columns 로 비율을 지정해 컨트롤 영역 전체 폭을 채웁니다'
  ],
  'multi-button': ['주 액션 버튼을 크게 강조', '위험 액션(삭제)은 색상으로 구분'],
  validation: [
    '버튼 클릭 시 유효성 검사가 실행됩니다',
    '에러 필드는 빨간 테두리 + 메시지로 표시',
    'react-hook-form(또는 동등) 과 연동 권장'
  ],
  readonly: ['readOnly 는 포커스 가능, disabled 는 포커스 불가', '조회 모드는 readOnly, 완전 잠금은 disabled 사용']
}
</script>

<template>
  <div>
    <PageHeader
      title="Form"
      component="Form"
      desc="— Form + Form.Field + Form.Actions 컴파운드. 세로·가로·2컬럼·범위·인라인 복합·유효성 검사·읽기전용 패턴을 제공합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection :title="TITLE[tab]" :code="CODE[tab]" :notes="NOTES[tab]">
          <!-- vertical -->
          <Form v-if="tab === 'vertical'" :style="{maxWidth: '400px'}">
            <Form.Field label="이름" required><Input.Text placeholder="홍길동" /></Form.Field>
            <Form.Field label="이메일" required><Input.Email placeholder="user@example.com" /></Form.Field>
            <Form.Field label="전화번호"><Input.Tel placeholder="010-0000-0000" /></Form.Field>
            <Form.Field label="부서"><Select :options="DEPT" placeholder="선택하세요" /></Form.Field>
            <Form.Actions :align="FORM_ACTIONS_ALIGN['BETWEEN']">
              <Button :variant="BUTTON_VARIANT['GHOST']" full-width>취소</Button>
              <Button html-type="submit" full-width>저장</Button>
            </Form.Actions>
          </Form>

          <!-- horizontal -->
          <Form
            v-else-if="tab === 'horizontal'"
            :layout="FORM_LAYOUT['HORIZONTAL']"
            :label-width="80"
            :style="{maxWidth: '480px'}"
          >
            <Form.Field label="이름" required><Input.Text placeholder="홍길동" /></Form.Field>
            <Form.Field label="이메일" required><Input.Email placeholder="user@example.com" /></Form.Field>
            <Form.Field label="전화번호"><Input.Tel placeholder="010-0000-0000" /></Form.Field>
            <Form.Field label="부서"><Select :options="DEPT" placeholder="선택하세요" /></Form.Field>
            <Form.Actions>
              <Button :variant="BUTTON_VARIANT['GHOST']">취소</Button>
              <Button html-type="submit">저장</Button>
            </Form.Actions>
          </Form>

          <!-- 2column -->
          <Form v-else-if="tab === '2column'" :style="{maxWidth: '560px'}">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <Form.Field label="성" required><Input.Text placeholder="홍" /></Form.Field>
              <Form.Field label="이름" required><Input.Text placeholder="길동" /></Form.Field>
              <Form.Field label="이메일" required><Input.Email placeholder="user@example.com" /></Form.Field>
              <Form.Field label="전화번호"><Input.Tel placeholder="010-0000-0000" /></Form.Field>
              <Form.Field label="생년월일"><Input.Text placeholder="YYYY-MM-DD" /></Form.Field>
              <Form.Field label="부서"><Select :options="DEPT" placeholder="선택하세요" /></Form.Field>
            </div>
            <Form.Field label="주소"><Input.Text placeholder="서울특별시 강남구 테헤란로" /></Form.Field>
            <Form.Field label="메모"><Textarea placeholder="추가 내용" :rows="3" /></Form.Field>
            <Form.Actions>
              <Button :variant="BUTTON_VARIANT['GHOST']">초기화</Button>
              <Button html-type="submit">등록</Button>
            </Form.Actions>
          </Form>

          <!-- searchbar : 라벨 열은 가장 긴 라벨(검색어) 기준으로 모든 행이 공유 -->
          <Form v-else-if="tab === 'searchbar'" :style="{maxWidth: '560px'}">
            <Form.Field label="검색어" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--search">
                <Input.Search placeholder="검색어를 입력해주세요" />
                <Button html-type="submit">검색</Button>
              </div>
            </Form.Field>
            <Form.Field label="사번" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--id">
                <Input.Text placeholder="EMP-0000" />
                <Button :variant="BUTTON_VARIANT['GHOST']">조회</Button>
                <Button>확인</Button>
              </div>
            </Form.Field>
            <Form.Field label="조건" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--condition">
                <Select :options="CONDITION" placeholder="이름" />
                <Input.Text placeholder="검색값" />
                <Button>검색</Button>
              </div>
            </Form.Field>
          </Form>

          <!-- range : 모든 행이 같은 4열 그리드 → 시작 / ~ / 종료 / 부가 영역이 세로로 정렬 -->
          <Form v-else-if="tab === 'range'" :style="{maxWidth: '560px'}">
            <Form.Field label="기간" required :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--range">
                <Input.Text placeholder="YYYY-MM-DD" />
                <span class="demo-form-sep">~</span>
                <Input.Text placeholder="YYYY-MM-DD" />
                <span class="demo-form-tail">
                  <Button :variant="BUTTON_VARIANT['GHOST']">오늘</Button>
                  <Button :variant="BUTTON_VARIANT['GHOST']">이번 달</Button>
                </span>
              </div>
            </Form.Field>
            <Form.Field label="금액" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--range">
                <Input.Number placeholder="최소 금액" />
                <span class="demo-form-sep">~</span>
                <Input.Number placeholder="최대 금액" />
                <span class="demo-form-tail demo-form-unit">원</span>
              </div>
            </Form.Field>
            <Form.Field label="시간" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--range">
                <Input.Text placeholder="HH:mm" default-value="09:00" />
                <span class="demo-form-sep">~</span>
                <Input.Text placeholder="HH:mm" default-value="18:00" />
                <span class="demo-form-tail" />
              </div>
            </Form.Field>
          </Form>

          <!-- inline-multi : 모든 행이 컨트롤 영역 전체 폭을 채움 -->
          <Form v-else-if="tab === 'inline-multi'" :style="{maxWidth: '600px'}">
            <Form.Field label="성명" required :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--name">
                <Input.Text placeholder="성" />
                <Input.Text placeholder="이름" />
              </div>
            </Form.Field>
            <Form.Field label="주소" required :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-stack">
                <div class="demo-form-row demo-form-row--zip">
                  <Input.Text placeholder="우편번호" />
                  <Button :variant="BUTTON_VARIANT['GHOST']">주소 검색</Button>
                </div>
                <Input.Text placeholder="기본 주소" />
                <Input.Text placeholder="상세 주소 (동/호수)" />
              </div>
            </Form.Field>
            <Form.Field label="전화번호" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--phone">
                <Input.Text default-value="010" />
                <span class="demo-form-sep">-</span>
                <Input.Text placeholder="0000" />
                <span class="demo-form-sep">-</span>
                <Input.Text placeholder="0000" />
              </div>
            </Form.Field>
            <Form.Field label="수량" :layout="FORM_LAYOUT['INLINE']">
              <div class="demo-form-row demo-form-row--qty">
                <Input.Number placeholder="0" />
                <Select :options="UNIT" placeholder="개" />
                <span class="demo-form-unit">재고: 50개</span>
              </div>
            </Form.Field>
          </Form>

          <!-- multi-button -->
          <Form v-else-if="tab === 'multi-button'" :style="{maxWidth: '480px'}">
            <Form.Field label="제목" required><Input.Text placeholder="제목을 입력해주세요" /></Form.Field>
            <Form.Field label="내용"><Textarea :rows="4" /></Form.Field>
            <Form.Field label="카테고리"><Select :options="CATEGORY" placeholder="선택하세요" /></Form.Field>
            <Form.Actions :align="FORM_ACTIONS_ALIGN['BETWEEN']">
              <Button :variant="BUTTON_VARIANT['GHOST']" @click="status = '임시저장'">임시저장</Button>
              <Button @click="status = '등록완료'">등록</Button>
              <Button :variant="BUTTON_VARIANT['SECONDARY']" @click="status = '삭제'">삭제</Button>
            </Form.Actions>
            <span v-if="status" class="demo-hint">→ {{ status }}</span>
          </Form>

          <!-- validation -->
          <Form v-else-if="tab === 'validation'" :style="{maxWidth: '400px'}" @submit="validate">
            <Form.Field label="이름" required :error="errors.name">
              <Input.Text
                :value="vform.name"
                :error="Boolean(errors.name)"
                placeholder="홍길동"
                @change="vform.name = ($event.target as HTMLInputElement).value"
              />
            </Form.Field>
            <Form.Field label="이메일" required :error="errors.email">
              <Input.Email
                :value="vform.email"
                :error="Boolean(errors.email)"
                placeholder="user@example.com"
                @change="vform.email = ($event.target as HTMLInputElement).value"
              />
            </Form.Field>
            <Form.Field label="비밀번호" required :error="errors.pw" help="8자 이상">
              <Input.Password
                :value="vform.pw"
                :error="Boolean(errors.pw)"
                placeholder="8자 이상"
                @change="vform.pw = ($event.target as HTMLInputElement).value"
              />
            </Form.Field>
            <Form.Actions>
              <Button html-type="submit">검증하기</Button>
            </Form.Actions>
          </Form>

          <!-- readonly -->
          <div
            v-else-if="tab === 'readonly'"
            style="display: flex; flex-direction: column; gap: 14px; max-width: 400px"
          >
            <div
              style="
                padding: 8px 14px;
                border-radius: 8px;
                font-size: 13px;
                background: var(--m2m-pg-info-bg);
                border: 1px solid var(--m2m-pg-info-border);
                color: var(--m2m-pg-info-dark);
              "
            >
              ℹ 조회 모드: 수정 불가 상태입니다.
            </div>
            <Form :layout="FORM_LAYOUT['HORIZONTAL']" :label-width="72" disabled>
              <Form.Field label="이름"><Input.Text default-value="홍길동" /></Form.Field>
              <Form.Field label="이메일"><Input.Email default-value="hong@example.com" /></Form.Field>
              <Form.Field label="부서"><Input.Text default-value="개발팀" /></Form.Field>
              <Form.Field label="입사일"><Input.Text default-value="2024-03-01" /></Form.Field>
            </Form>
            <Form.Actions :align="FORM_ACTIONS_ALIGN['BETWEEN']">
              <Button :variant="BUTTON_VARIANT['GHOST']" full-width>목록으로</Button>
              <Button full-width>수정 모드로 전환</Button>
            </Form.Actions>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>

<style>
/* Form 데모 전용 — 행 안의 요소를 그리드로 배치해 행마다 좌우 끝이 맞도록 한다 */
.demo-form-row {
  display: grid;
  /* 버튼이 인풋(40px) 높이에 맞도록 행 높이만큼 늘린다 */
  align-items: stretch;
  gap: 8px;
}
.demo-form-row--search {
  grid-template-columns: minmax(0, 1fr) auto;
}
.demo-form-row--id {
  grid-template-columns: minmax(0, 1fr) auto auto;
}
.demo-form-row--condition {
  grid-template-columns: 120px minmax(0, 1fr) auto;
}
.demo-form-row--range {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) 168px;
}
.demo-form-row--name {
  grid-template-columns: 120px minmax(0, 1fr);
}
.demo-form-row--zip {
  grid-template-columns: minmax(0, 1fr) auto;
}
.demo-form-row--phone {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
}
.demo-form-row--qty {
  grid-template-columns: minmax(0, 1fr) 120px auto;
}
.demo-form-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.demo-form-sep {
  align-self: center;
  font-weight: 700;
  color: var(--m2m-pg-comp-text-disabled);
}
.demo-form-tail {
  display: inline-flex;
  gap: 6px;
  align-items: stretch;
}
.demo-form-unit {
  align-self: center;
  font-size: 13px;
  color: var(--m2m-pg-comp-text-disabled);
  white-space: nowrap;
}
</style>
