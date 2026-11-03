<script setup lang="ts">
import {ref} from 'vue'

import Button from '~/components/Button'
import Cascader, {CascaderPanel, CASCADER_EXPAND_TRIGGER, CASCADER_SIZE} from '~/components/Cascader'
import type {CascaderModelValue, CascaderNode, CascaderOption} from '~/components/Cascader'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = [
  'basic',
  'disabled',
  'clearable',
  'showAllLevels',
  'multiple',
  'collapseTags',
  'checkStrictly',
  'emitPath',
  'lazy',
  'filterable',
  'slot',
  'size',
  'error',
  'events',
  'panel'
]

const OPTIONS: CascaderOption[] = [
  {
    value: 'seoul',
    label: '서울',
    children: [
      {value: 'gangnam', label: '강남구'},
      {value: 'seocho', label: '서초구'},
      {value: 'mapo', label: '마포구'}
    ]
  },
  {
    value: 'gyeonggi',
    label: '경기',
    children: [
      {
        value: 'suwon',
        label: '수원시',
        children: [
          {value: 'yeongtong', label: '영통구'},
          {value: 'paldal', label: '팔달구'},
          {value: 'jangan', label: '장안구'}
        ]
      },
      {
        value: 'seongnam',
        label: '성남시',
        children: [
          {value: 'bundang', label: '분당구'},
          {value: 'sujeong', label: '수정구'}
        ]
      },
      {value: 'goyang', label: '고양시'}
    ]
  },
  {
    value: 'busan',
    label: '부산',
    children: [
      {value: 'haeundae', label: '해운대구'},
      {value: 'suyeong', label: '수영구'},
      {value: 'busanjin', label: '부산진구'}
    ]
  },
  {value: 'jeju', label: '제주'}
]

/** 일부 항목 비활성 */
const WITH_DISABLED: CascaderOption[] = [
  {
    value: 'seoul',
    label: '서울',
    children: [
      {value: 'gangnam', label: '강남구'},
      {value: 'seocho', label: '서초구', disabled: true}
    ]
  },
  {
    value: 'gyeonggi',
    label: '경기 (비활성)',
    disabled: true,
    children: [{value: 'suwon', label: '수원시'}]
  },
  {value: 'busan', label: '부산', children: [{value: 'haeundae', label: '해운대구'}]}
]

/** config.value/label/children/disabled 키 매핑용 */
const CUSTOM_KEYS: CascaderOption[] = [
  {
    id: 'seoul',
    name: '서울',
    items: [
      {id: 'gangnam', name: '강남구'},
      {id: 'seocho', name: '서초구', off: true}
    ]
  },
  {id: 'busan', name: '부산', items: [{id: 'haeundae', name: '해운대구'}]}
]

const wrap = 'max-width:320px'

// v-model 상태
const basic = ref<CascaderModelValue>(['seoul', 'gangnam'])
const hover = ref<CascaderModelValue>([])
const disabledV = ref<CascaderModelValue>([])
const clearableV = ref<CascaderModelValue>(['gyeonggi', 'suwon', 'yeongtong'])
const lastLevel = ref<CascaderModelValue>(['gyeonggi', 'suwon', 'yeongtong'])
const multi = ref<CascaderModelValue>([
  ['seoul', 'gangnam'],
  ['gyeonggi', 'suwon', 'yeongtong']
])
const collapse = ref<CascaderModelValue>([
  ['seoul', 'gangnam'],
  ['seoul', 'seocho'],
  ['busan', 'haeundae']
])
const strict = ref<CascaderModelValue>(['gyeonggi'])
const strictMulti = ref<CascaderModelValue>([['seoul'], ['gyeonggi', 'suwon']])
const pathOff = ref<CascaderModelValue>('yeongtong')
const pathOffMulti = ref<CascaderModelValue>(['gangnam', 'haeundae'])
const lazyV = ref<CascaderModelValue>([])
const lazyMulti = ref<CascaderModelValue>([])
const filterV = ref<CascaderModelValue>([])
const filterMulti = ref<CascaderModelValue>([])
const slotV = ref<CascaderModelValue>([])
const sizeV = ref<CascaderModelValue>(['seoul', 'gangnam'])
const errorV = ref<CascaderModelValue>([])
const eventV = ref<CascaderModelValue>([])
const panelV = ref<CascaderModelValue>(['seoul', 'gangnam'])
const panelMulti = ref<CascaderModelValue>([])
const keyMapV = ref<CascaderModelValue>([])

const log = ref<string[]>([])
const push = (msg: string) => (log.value = [msg, ...log.value].slice(0, 5))

// 동적 로딩 — 1단계는 즉시, 이후 레벨은 0.6초 뒤 생성
let lazyId = 0
function lazyLoad(node: CascaderNode, resolve: (data?: CascaderOption[]) => void) {
  const {level} = node
  setTimeout(() => {
    const nodes = Array.from({length: level + 1}, () => {
      const id = ++lazyId
      return {value: id, label: `옵션 ${id}`, leaf: level >= 2}
    })
    resolve(nodes)
  }, 600)
}

function customFilter(node: CascaderNode, keyword: string) {
  return node.label.includes(keyword) || String(node.value).includes(keyword.toLowerCase())
}

async function beforeFilter(keyword: string) {
  push(`beforeFilter("${keyword}")`)
  return keyword.trim().length > 0
}

const text = (v: CascaderModelValue) => JSON.stringify(v)
const importLine = "import Cascader from 'm2m-uiux-vue/Cascader'"
const SCRIPT_OPEN = '<script setup lang="ts">'
const SCRIPT_CLOSE = '<\/script>'
const OPT_SAMPLE = [
  'const options = [',
  "  {value: 'seoul', label: '서울', children: [{value: 'gangnam', label: '강남구'}]},",
  "  {value: 'gyeonggi', label: '경기', children: [{value: 'suwon', label: '수원시'}]}",
  ']'
]
const sfc = (script: string[], template: string[]) => [
  SCRIPT_OPEN,
  "import {ref} from 'vue'",
  importLine,
  '',
  ...script,
  SCRIPT_CLOSE,
  '',
  '<template>',
  ...template.map((l) => `  ${l}`),
  '</template>'
]

const CODE = {
  basic: sfc(
    [...OPT_SAMPLE, "const value = ref(['seoul', 'gangnam'])"],
    ['<Cascader v-model="value" :options="options" />']
  ),
  hover: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    ['<Cascader v-model="value" :options="options" :config="{expandTrigger: \'hover\'}" />']
  ),
  disabled: sfc(
    [
      'const options = [',
      "  {value: 'seoul', label: '서울', children: [",
      "    {value: 'gangnam', label: '강남구'},",
      "    {value: 'seocho', label: '서초구', disabled: true}",
      '  ]}',
      ']'
    ],
    ['<Cascader :options="options" />', '<Cascader :options="options" disabled />']
  ),
  keyMap: sfc(
    [
      '// disabled 키 이름 바꾸기 — config.disabled / value / label / children',
      'const options = [',
      "  {id: 'seoul', name: '서울', items: [{id: 'seocho', name: '서초구', off: true}]}",
      ']'
    ],
    ["<Cascader :options=\"options\" :config=\"{value: 'id', label: 'name', children: 'items', disabled: 'off'}\" />"]
  ),
  clearable: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    ['<Cascader v-model="value" :options="options" clearable />']
  ),
  showAllLevels: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options" :show-all-levels="false" />',
      '<Cascader v-model="value" :options="options" separator=" > " />'
    ]
  ),
  multiple: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    ['<Cascader v-model="value" :options="options" :config="{multiple: true}" />']
  ),
  collapseTags: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    ['<Cascader v-model="value" :options="options" :config="{multiple: true}" collapse-tags clearable />']
  ),
  checkStrictly: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options" :config="{checkStrictly: true}" />',
      '<Cascader v-model="multi" :options="options" :config="{checkStrictly: true, multiple: true}" />'
    ]
  ),
  emitPath: sfc(
    [...OPT_SAMPLE, "const value = ref('gangnam')   // 경로가 아닌 마지막 value 만"],
    ['<Cascader v-model="value" :options="options" :config="{emitPath: false}" />']
  ),
  lazy: sfc(
    [
      "import type {CascaderNode, CascaderOption} from 'm2m-uiux-vue/Cascader'",
      '',
      'let id = 0',
      'function lazyLoad(node: CascaderNode, resolve: (data?: CascaderOption[]) => void) {',
      '  setTimeout(() => {',
      '    resolve(Array.from({length: node.level + 1}, () => ({',
      '      value: ++id,',
      '      label: `옵션 ${id}`,',
      '      leaf: node.level >= 2   // 더 이상 하위 없음',
      '    })))',
      '  }, 600)',
      '}',
      'const value = ref([])'
    ],
    ['<Cascader v-model="value" :config="{lazy: true, lazyLoad}" />']
  ),
  filterable: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options" filterable />',
      '<Cascader v-model="value" :options="options" :config="{multiple: true}" filterable />'
    ]
  ),
  filterMethod: sfc(
    [
      ...OPT_SAMPLE,
      "import type {CascaderNode} from 'm2m-uiux-vue/Cascader'",
      'const filterMethod = (node: CascaderNode, keyword: string) =>',
      '  node.label.includes(keyword) || String(node.value).includes(keyword.toLowerCase())',
      'const beforeFilter = (keyword: string) => keyword.trim().length > 0  // false 면 검색 취소',
      'const value = ref([])'
    ],
    [
      '<Cascader v-model="value" :options="options" filterable :filter-method="filterMethod"',
      '  :before-filter="beforeFilter" :debounce="500" />'
    ]
  ),
  slot: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options">',
      '  <template #default="{node, data}">',
      '    <span>{{ node.label }}</span>',
      '    <span v-if="!node.leaf"> ({{ node.children.length }})</span>',
      '  </template>',
      '  <template #empty>데이터가 없어요</template>',
      '</Cascader>'
    ]
  ),
  size: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options" size="sm" />',
      '<Cascader v-model="value" :options="options" size="md" />',
      '<Cascader v-model="value" :options="options" size="lg" />'
    ]
  ),
  error: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader v-model="value" :options="options" error="지역을 선택해주세요" />',
      '<Cascader v-model="value" :options="options" helper-text="시/군/구까지 선택" />'
    ]
  ),
  events: sfc(
    [...OPT_SAMPLE, 'const value = ref([])'],
    [
      '<Cascader',
      '  v-model="value"',
      '  :options="options"',
      '  :config="{multiple: true}"',
      '  @change="(v) => console.log(\'change\', v)"',
      '  @expand-change="(path) => console.log(\'expand\', path)"',
      '  @visible-change="(open) => console.log(\'visible\', open)"',
      '  @remove-tag="(v) => console.log(\'remove-tag\', v)"',
      '  @focus="() => {}"',
      '  @blur="() => {}"',
      '/>'
    ]
  ),
  panel: [
    SCRIPT_OPEN,
    "import {ref} from 'vue'",
    "import {CascaderPanel} from 'm2m-uiux-vue/Cascader'",
    '',
    ...OPT_SAMPLE,
    "const value = ref(['seoul', 'gangnam'])",
    SCRIPT_CLOSE,
    '',
    '<template>',
    '  <CascaderPanel v-model="value" :options="options" />',
    '  <CascaderPanel v-model="multi" :options="options" :config="{multiple: true}" />',
    '</template>'
  ],
  getChecked: [
    SCRIPT_OPEN,
    "import {ref} from 'vue'",
    '',
    'const cascader = ref()',
    '// 선택된 노드(leafOnly 면 leaf 만) 조회',
    'const nodes = cascader.value.getCheckedNodes(true)',
    SCRIPT_CLOSE,
    '',
    '<template>',
    '  <Cascader ref="cascader" v-model="value" :options="options" :config="{multiple: true}" />',
    '</template>'
  ]
}

const checkedRef = ref<InstanceType<typeof Cascader>>()
const checkedLabel = ref('(없음)')
function readChecked() {
  const nodes = checkedRef.value?.getCheckedNodes(true) ?? []
  checkedLabel.value = nodes.map((n) => n.pathLabels.join('/')).join(', ') || '(없음)'
}

const SIZES = Object.keys(CASCADER_SIZE) as (keyof typeof CASCADER_SIZE)[]
const HOVER = {expandTrigger: CASCADER_EXPAND_TRIGGER['HOVER']}
const MULTI = {multiple: true}
const STRICT = {checkStrictly: true}
const STRICT_MULTI = {checkStrictly: true, multiple: true}
const PATH_OFF = {emitPath: false}
const PATH_OFF_MULTI = {emitPath: false, multiple: true}
const LAZY = {lazy: true, lazyLoad}
const LAZY_MULTI = {lazy: true, lazyLoad, multiple: true}
const KEY_MAP = {value: 'id', label: 'name', children: 'items', disabled: 'off'}
</script>

<template>
  <div>
    <PageHeader
      title="Cascader"
      component="Cascader"
      desc="— 계층(시/도 → 시/군/구 …) 데이터를 단계별 메뉴로 선택하는 드롭다운. 다중 선택 · 동적 로딩 · 검색을 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <!-- ─────────── basic ─────────── -->
        <template v-if="tab === 'basic'">
          <ComponentSection
            title="기본 — 클릭으로 하위 메뉴 펼치기"
            :code="CODE.basic"
            :notes="['v-model 은 선택 경로 배열 (emitPath 기본 true)', '← → ↑ ↓ 로 이동, Enter 선택, Esc 닫기']"
          >
            <div class="demo-col" :style="wrap">
              <Cascader v-model="basic" :options="OPTIONS" />
              <span class="demo-hint">선택값: {{ text(basic) }}</span>
            </div>
          </ComponentSection>
          <ComponentSection title="config.expandTrigger = 'hover' — 마우스 오버로 펼치기" :code="CODE.hover">
            <div class="demo-col" :style="wrap">
              <Cascader v-model="hover" :options="OPTIONS" :config="HOVER" />
              <span class="demo-hint">선택값: {{ text(hover) }}</span>
            </div>
          </ComponentSection>
        </template>

        <!-- ─────────── disabled ─────────── -->
        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="비활성 옵션 — 옵션의 disabled / 컴포넌트 disabled"
            :code="CODE.disabled"
            :notes="['부모가 disabled 면 자식도 선택할 수 없습니다 (checkStrictly 제외)']"
          >
            <div class="demo-col" :style="wrap">
              <Cascader v-model="disabledV" :options="WITH_DISABLED" />
              <Cascader :options="OPTIONS" :model-value="['seoul', 'gangnam']" disabled />
            </div>
          </ComponentSection>
          <ComponentSection
            title="config 키 매핑 — value / label / children / disabled 이름 바꾸기"
            :code="CODE.keyMap"
          >
            <div class="demo-col" :style="wrap">
              <Cascader v-model="keyMapV" :options="CUSTOM_KEYS" :config="KEY_MAP" />
            </div>
          </ComponentSection>
        </template>

        <!-- ─────────── clearable ─────────── -->
        <ComponentSection
          v-else-if="tab === 'clearable'"
          title="clearable — 값이 있을 때 hover 하면 지우기 아이콘"
          :code="CODE.clearable"
          :notes="['터치 기기에서는 지우기 아이콘이 항상 보입니다']"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="clearableV" :options="OPTIONS" clearable />
            <span class="demo-hint">선택값: {{ text(clearableV) }}</span>
          </div>
        </ComponentSection>

        <!-- ─────────── showAllLevels ─────────── -->
        <ComponentSection
          v-else-if="tab === 'showAllLevels'"
          title="showAllLevels=false — 마지막 레벨만 표시 / separator 변경"
          :code="CODE.showAllLevels"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="lastLevel" :options="OPTIONS" :show-all-levels="false" />
            <Cascader v-model="lastLevel" :options="OPTIONS" separator=" > " />
          </div>
        </ComponentSection>

        <!-- ─────────── multiple ─────────── -->
        <ComponentSection
          v-else-if="tab === 'multiple'"
          title="config.multiple — 다중 선택"
          :code="CODE.multiple"
          :notes="[
            '부모 체크박스를 누르면 활성 leaf 전체가 선택/해제되고, 일부만 선택되면 반선택(−) 표시',
            'v-model 은 경로 배열의 배열 (emitPath=false 면 value 배열)',
            '태그의 × 또는 Backspace 로 제거',
            '드롭다운은 선택해도 닫히지 않음'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="multi" :options="OPTIONS" :config="MULTI" />
            <span class="demo-hint">선택값: {{ text(multi) }}</span>
          </div>
        </ComponentSection>

        <!-- ─────────── collapseTags ─────────── -->
        <ComponentSection
          v-else-if="tab === 'collapseTags'"
          title="collapseTags — 태그를 첫 개 + '+N' 으로 접기"
          :code="CODE.collapseTags"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="collapse" :options="OPTIONS" :config="MULTI" collapse-tags clearable />
            <Cascader v-model="collapse" :options="OPTIONS" :config="MULTI" />
          </div>
        </ComponentSection>

        <!-- ─────────── checkStrictly ─────────── -->
        <ComponentSection
          v-else-if="tab === 'checkStrictly'"
          title="config.checkStrictly — 아무 레벨이나 선택 (부모/자식 독립)"
          :code="CODE.checkStrictly"
          :notes="[
            '단일: 각 항목의 라디오로 선택 (항목명 클릭은 펼치기)',
            '다중: 부모와 자식이 서로 영향 없이 개별 체크'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="strict" :options="OPTIONS" :config="STRICT" />
            <Cascader v-model="strictMulti" :options="OPTIONS" :config="STRICT_MULTI" />
          </div>
        </ComponentSection>

        <!-- ─────────── emitPath ─────────── -->
        <ComponentSection
          v-else-if="tab === 'emitPath'"
          title="config.emitPath=false — 경로 대신 마지막 value 만"
          :code="CODE.emitPath"
          :notes="['value 가 옵션 전체에서 유일해야 합니다']"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="pathOff" :options="OPTIONS" :config="PATH_OFF" />
            <span class="demo-hint">선택값: {{ text(pathOff) }}</span>
            <Cascader v-model="pathOffMulti" :options="OPTIONS" :config="PATH_OFF_MULTI" />
            <span class="demo-hint">선택값: {{ text(pathOffMulti) }}</span>
          </div>
        </ComponentSection>

        <!-- ─────────── lazy ─────────── -->
        <ComponentSection
          v-else-if="tab === 'lazy'"
          title="config.lazy + lazyLoad — 동적 로딩"
          :code="CODE.lazy"
          :notes="[
            'lazyLoad(node, resolve) — resolve 로 하위 옵션 전달, 빈 배열이면 leaf 처리',
            'options 가 비어 있으면 루트도 lazyLoad 로 가져옵니다 (node.level = 0)',
            '옵션의 leaf: true 로 더 이상 하위가 없음을 미리 알릴 수 있습니다'
          ]"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="lazyV" :config="LAZY" />
            <Cascader v-model="lazyMulti" :config="LAZY_MULTI" />
          </div>
        </ComponentSection>

        <!-- ─────────── filterable ─────────── -->
        <template v-else-if="tab === 'filterable'">
          <ComponentSection
            title="filterable — 옵션 검색"
            :code="CODE.filterable"
            :notes="['입력 후 debounce(기본 300ms) 뒤에 검색 결과 목록으로 전환', '결과 항목은 전체 경로로 표시']"
          >
            <div class="demo-col" :style="wrap">
              <Cascader v-model="filterV" :options="OPTIONS" filterable />
              <Cascader v-model="filterMulti" :options="OPTIONS" :config="MULTI" filterable />
            </div>
          </ComponentSection>
          <ComponentSection
            title="filterMethod · beforeFilter · debounce — 검색 커스터마이징"
            :code="CODE.filterMethod"
            :notes="['beforeFilter 가 false 또는 reject 되는 Promise 를 돌려주면 검색을 중단']"
          >
            <div class="demo-col" :style="wrap">
              <Cascader
                v-model="filterV"
                :options="OPTIONS"
                filterable
                :filter-method="customFilter"
                :before-filter="beforeFilter"
                :debounce="500"
              />
              <span class="demo-hint">최근 로그: {{ log.join(' | ') || '(없음)' }}</span>
            </div>
          </ComponentSection>
        </template>

        <!-- ─────────── slot ─────────── -->
        <ComponentSection
          v-else-if="tab === 'slot'"
          title="slot — 노드 내용 커스터마이징 · empty"
          :code="CODE.slot"
          :notes="['기본 slot 파라미터: { node, data }']"
        >
          <div class="demo-col" :style="wrap">
            <Cascader v-model="slotV" :options="OPTIONS">
              <template #default="{node, data}">
                <span>{{ node.label }}</span>
                <span v-if="!node.leaf" style="color: var(--m2m-pg-comp-text-muted)">
                  ({{ node.children.length }})</span
                >
                <span v-else style="color: var(--m2m-pg-comp-text-muted)"> · {{ data.value }}</span>
              </template>
            </Cascader>
            <Cascader :options="[]">
              <template #empty>표시할 지역이 없어요</template>
            </Cascader>
          </div>
        </ComponentSection>

        <!-- ─────────── size ─────────── -->
        <template v-else-if="tab === 'size'">
          <ComponentSection
            v-for="s in SIZES"
            :key="s"
            :title="`size=&quot;${CASCADER_SIZE[s]}&quot;${s === 'MD' ? ' (기본)' : ''}`"
            :code="CODE.size"
          >
            <div class="demo-col" :style="wrap">
              <Cascader v-model="sizeV" :options="OPTIONS" :size="CASCADER_SIZE[s]" />
            </div>
          </ComponentSection>
        </template>

        <!-- ─────────── error ─────────── -->
        <ComponentSection v-else-if="tab === 'error'" title="error · helperText · placeholder" :code="CODE.error">
          <div class="demo-col" :style="wrap">
            <Cascader v-model="errorV" :options="OPTIONS" error="지역을 선택해주세요" placeholder="지역 선택" />
            <Cascader v-model="errorV" :options="OPTIONS" helper-text="시/군/구까지 선택해주세요" />
          </div>
        </ComponentSection>

        <!-- ─────────── events ─────────── -->
        <template v-else-if="tab === 'events'">
          <ComponentSection
            title="이벤트 — change · expand-change · visible-change · remove-tag · focus · blur"
            :code="CODE.events"
          >
            <div class="demo-col" :style="wrap">
              <Cascader
                v-model="eventV"
                :options="OPTIONS"
                :config="MULTI"
                @change="(v) => push(`change ${text(v)}`)"
                @expand-change="(p) => push(`expand-change ${text(p)}`)"
                @visible-change="(o) => push(`visible-change ${o}`)"
                @remove-tag="(v) => push(`remove-tag ${text(v)}`)"
                @focus="() => push('focus')"
                @blur="() => push('blur')"
              />
              <span v-for="(l, i) in log" :key="i" class="demo-hint">{{ l }}</span>
            </div>
          </ComponentSection>
          <ComponentSection title="getCheckedNodes(leafOnly) — 선택 노드 조회" :code="CODE.getChecked">
            <div class="demo-col" :style="wrap">
              <Cascader ref="checkedRef" v-model="multi" :options="OPTIONS" :config="MULTI" />
              <Button @click="readChecked">getCheckedNodes(true)</Button>
              <span class="demo-hint">결과: {{ checkedLabel }}</span>
            </div>
          </ComponentSection>
        </template>

        <!-- ─────────── panel ─────────── -->
        <ComponentSection
          v-else-if="tab === 'panel'"
          title="CascaderPanel — 드롭다운 없이 패널만 단독 사용"
          :code="CODE.panel"
          :notes="['Cascader 와 동일한 options · config · v-model · slot · expand-change 를 지원']"
        >
          <div class="demo-col">
            <CascaderPanel v-model="panelV" :options="OPTIONS" />
            <span class="demo-hint">선택값: {{ text(panelV) }}</span>
            <CascaderPanel v-model="panelMulti" :options="OPTIONS" :config="MULTI" />
            <span class="demo-hint">선택값: {{ text(panelMulti) }}</span>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
