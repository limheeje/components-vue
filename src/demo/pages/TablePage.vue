<script setup lang="ts">
import {defineComponent, h, ref} from 'vue'
import type {PropType} from 'vue'

import Table, {TABLE_ALIGN} from '~/components/Table'
import type {TableAlign, TableColumn, TableHeadCell} from '~/components/Table'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = [
  'columns',
  'data',
  'selectable',
  'sortable',
  'pagination',
  'striped',
  'colspan',
  'rowspan',
  'empty',
  'loading',
  'classNames'
]

interface Person {
  id: number
  name: string
  email?: string
  role: string
  status: string
}

const DATA: Person[] = [
  {id: 1, name: '홍길동', email: 'hong@ex.com', role: '개발자', status: '활성'},
  {id: 2, name: '김철수', email: 'kim@ex.com', role: '디자이너', status: '비활성'},
  {id: 3, name: '이영희', email: 'lee@ex.com', role: '기획자', status: '활성'},
  {id: 4, name: '박민준', email: 'park@ex.com', role: '개발자', status: '활성'},
  {id: 5, name: '최유진', email: 'choi@ex.com', role: '디자이너', status: '비활성'}
]

const PAGE_DATA: Person[] = Array.from({length: 24}, (_, i) => ({
  id: i + 1,
  name: ['홍길동', '김철수', '이영희', '박민준', '최유진'][i % 5] as string,
  role: ['개발자', '디자이너', '기획자'][i % 3] as string,
  status: i % 3 === 1 ? '비활성' : '활성'
}))

function statusBadge(value: unknown) {
  const on = value === '활성'
  return h(
    'span',
    {
      style: {
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        background: on ? 'var(--m2m-pg-success-bg)' : 'var(--m2m-pg-comp-bg-hover)',
        color: on ? 'var(--m2m-pg-success)' : 'var(--m2m-pg-comp-text-muted)'
      }
    },
    String(value)
  )
}

const COLUMNS: TableColumn<Person>[] = [
  {key: 'id', label: 'ID', width: 60},
  {key: 'name', label: '이름'},
  {key: 'email', label: '이메일'},
  {key: 'role', label: '역할'},
  {key: 'status', label: '상태', render: (v) => statusBadge(v)}
]

const SORT_COLUMNS: TableColumn<Person>[] = [
  {key: 'id', label: 'ID', width: 60, sortable: true},
  {key: 'name', label: '이름', sortable: true},
  {key: 'role', label: '역할', sortable: true},
  {key: 'status', label: '상태', render: (v) => statusBadge(v)}
]

const PAGE_COLUMNS: TableColumn<Person>[] = [
  {key: 'id', label: 'ID', width: 60},
  {key: 'name', label: '이름'},
  {key: 'role', label: '역할'},
  {key: 'status', label: '상태', render: (v) => statusBadge(v)}
]

const SelectableDemo = defineComponent({
  name: 'TableSelectableDemo',
  setup() {
    const selected = ref<(string | number)[]>([])
    return () =>
      h('div', {class: 'demo-col'}, [
        h(Table, {
          columns: COLUMNS.filter((c) => c.key !== 'email'),
          data: DATA.slice(0, 3),
          rowKey: 'id',
          selectable: true,
          selectedRowKeys: selected.value,
          onSelectionChange: (keys: (string | number)[]) => (selected.value = keys)
        }),
        h('span', {class: 'demo-hint'}, `selectedRowKeys: [${selected.value.join(', ')}]`)
      ])
  }
})

const PaginationDemo = defineComponent({
  name: 'TablePaginationDemo',
  props: {align: {type: String as PropType<TableAlign>, default: undefined}},
  setup(props) {
    const page = ref(1)
    return () =>
      h(Table, {
        columns: PAGE_COLUMNS,
        data: PAGE_DATA,
        rowKey: 'id',
        pagination: {page: page.value, pageSize: 5, align: props.align, onChange: (p: number) => (page.value = p)}
      })
  }
})

const QUARTER = [
  {product: '노트북', q1: 120, q2: 145, q3: 98},
  {product: '모니터', q1: 85, q2: 92, q3: 110},
  {product: '키보드', q1: 200, q2: 230, q3: 185}
]
const Q_HEAD: TableHeadCell[][] = [
  [
    {label: '제품명', rowSpan: 2, align: TABLE_ALIGN['LEFT']},
    {label: '1분기', align: TABLE_ALIGN['RIGHT']},
    {label: '2분기', align: TABLE_ALIGN['RIGHT']},
    {label: '3분기', align: TABLE_ALIGN['RIGHT']}
  ]
]
const Q_COLUMNS: TableColumn[] = [
  {key: 'product', label: '제품명'},
  {key: 'q1', label: '1분기', align: TABLE_ALIGN['RIGHT']},
  {key: 'q2', label: '2분기', align: TABLE_ALIGN['RIGHT']},
  {key: 'q3', label: '3분기', align: TABLE_ALIGN['RIGHT']}
]

const SCHEDULE = [
  {time: '09:00', owner: '전체팀', task: '스탠드업 미팅'},
  {time: '10:00', owner: '개발팀', task: '기능 개발'},
  {time: '11:00', owner: '개발팀', task: '코드 리뷰'},
  {time: '14:00', owner: '디자인팀', task: '디자인 워크샵'},
  {time: '15:00', owner: '디자인팀', task: '프로토타입 검토'},
  {time: '16:00', owner: '디자인팀', task: '디자인 확정'}
]
const SCHEDULE_COLUMNS: TableColumn[] = [
  {key: 'time', label: '시간', width: 80},
  {
    key: 'owner',
    label: '담당자',
    rowSpanKey: 'owner',
    align: TABLE_ALIGN['CENTER'],
    cellStyle: () => ({background: 'var(--m2m-pg-comp-bg-subtle)', fontWeight: 700})
  },
  {key: 'task', label: '업무'}
]

const STAFF = [
  {dept: '개발팀', name: '홍길동', position: '팀장'},
  {dept: '개발팀', name: '김철수', position: '선임'},
  {dept: '개발팀', name: '박민준', position: '주니어'},
  {dept: '디자인팀', name: '이영희', position: '팀장'},
  {dept: '디자인팀', name: '최유진', position: '선임'}
]
const STAFF_COLUMNS: TableColumn[] = [
  {
    key: 'dept',
    label: '부서',
    width: 100,
    rowSpanKey: 'dept',
    align: TABLE_ALIGN['CENTER'],
    cellStyle: () => ({background: 'var(--m2m-pg-comp-bg-subtle)', fontWeight: 700})
  },
  {key: 'name', label: '이름'},
  {key: 'position', label: '직급'}
]

/** renderRow 로 tbody colspan (카테고리 헤더 행 + 소계 행) */
const QUOTE: {type: 'item' | 'category' | 'subtotal'; label: string; qty?: number; amount: number}[] = [
  {type: 'category', label: '하드웨어', amount: 0},
  {type: 'item', label: '노트북', qty: 2, amount: 2400000},
  {type: 'item', label: '모니터', qty: 3, amount: 900000},
  {type: 'subtotal', label: '소계', amount: 3300000},
  {type: 'category', label: '소프트웨어', amount: 0},
  {type: 'item', label: '라이선스', qty: 5, amount: 1500000},
  {type: 'subtotal', label: '소계', amount: 1500000}
]
const won = (n: number) => `${n.toLocaleString()}원`
const qtd = 'padding:9px 12px;border-top:1px solid var(--m2m-pg-comp-border)'

const QuoteTable = defineComponent({
  name: 'QuoteTable',
  setup() {
    return () =>
      h(Table, {
        columns: [
          {key: 'label', label: '항목'},
          {key: 'qty', label: '수량', align: TABLE_ALIGN['CENTER'], width: 70},
          {key: 'amount', label: '금액', align: TABLE_ALIGN['RIGHT'], render: (v: unknown) => won(v as number)}
        ],
        data: QUOTE,
        renderRow: (row: (typeof QUOTE)[number], i: number) => {
          if (row.type === 'category')
            return h('tr', {key: i}, [
              h('td', {colspan: 3, style: `${qtd};font-weight:700;background:var(--m2m-pg-comp-bg-subtle)`}, row.label)
            ])
          if (row.type === 'subtotal')
            return h('tr', {key: i}, [
              h('td', {colspan: 2, style: `${qtd};text-align:right;font-weight:700`}, '소계'),
              h('td', {style: `${qtd};text-align:right;font-weight:700;color:var(--m2m-pg-brand)`}, won(row.amount))
            ])
          return null
        }
      })
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="Table (Datagrid)"
      component="Table"
      desc="— 데이터 그리드 테이블 컴포넌트. columns/data 배열로 구성합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'columns'"
          title="columns — 컬럼 정의"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '',
            'const columns = [',
            '  { key: \x27id\x27, label: \x27ID\x27, width: 60 },',
            '  { key: \x27name\x27, label: \x27이름\x27 },',
            '  { key: \x27status\x27, label: \x27상태\x27, render: (v) => statusBadge(v) },',
            ']',
            'const data = [{ id: 1, name: \x27홍길동\x27, status: \x27활성\x27 }]',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; row-key=&quot;id&quot; />',
            '</template>'
          ]"
          :notes="['render 함수로 셀 커스터마이징']"
        >
          <Table :columns="COLUMNS" :data="DATA.slice(0, 3)" row-key="id" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'data'"
          title="data — 데이터 배열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; row-key=&quot;id&quot; />',
            '</template>'
          ]"
          :notes="['row-key 는 필드명 또는 (row, i) => key 함수']"
        >
          <Table :columns="COLUMNS" :data="DATA" row-key="id" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'selectable'"
          title="selectable={true} — 행 선택 (클릭해보세요)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '',
            'const selected = ref([])',
            '</script>',
            '',
            '<template>',
            '  <Table',
            '    :columns=&quot;columns&quot;',
            '    :data=&quot;data&quot;',
            '    row-key=&quot;id&quot;',
            '    selectable',
            '    :selected-row-keys=&quot;selected&quot;',
            '    @selection-change=&quot;(keys) => (selected = keys)&quot;',
            '  />',
            '</template>'
          ]"
          :notes="['헤더 체크박스 = 전체 선택 · 행 클릭으로도 토글']"
        >
          <SelectableDemo />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'sortable'"
          title="sortable — 컬럼 정렬 (헤더 클릭)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '',
            'const columns = [{ key: \x27name\x27, label: \x27이름\x27, sortable: true }]',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; @sort-change=&quot;(sort) => console.log(sort)&quot; />',
            '</template>'
          ]"
          :notes="['1클릭 asc → 2클릭 desc → 3클릭 해제', 'sort prop 없으면 클라이언트에서 정렬']"
        >
          <Table :columns="SORT_COLUMNS" :data="DATA" row-key="id" />
        </ComponentSection>

        <template v-else-if="tab === 'pagination'">
          <ComponentSection
            v-for="a in ['right', 'center', 'left'] as const"
            :key="a"
            :title="
              a === 'right'
                ? 'pagination.align=\x27right\x27 — 기본값 (총 개수 위 / 페이저 아래 오른쪽)'
                : `pagination.align=\x27${a}\x27 — 페이저 ${a === 'center' ? '중앙' : '왼쪽'} 정렬`
            "
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '',
              'const page = ref(1)',
              '</script>',
              '',
              '<template>',
              '  <Table',
              '    :columns=&quot;columns&quot;',
              '    :data=&quot;data&quot;',
              '    row-key=&quot;id&quot;',
              `    :pagination=&quot;{ page, pageSize: 5, align: \x27${a}\x27, onChange: (p) => (page = p) }&quot;`,
              '  />',
              '</template>'
            ]"
            :notes="a === 'right' ? ['align: left · center · right — 총 개수는 항상 위 줄, 페이저는 아래 줄'] : []"
          >
            <PaginationDemo :align="a" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'striped'">
          <ComponentSection
            title="striped={true} — 줄무늬 스타일"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '</script>',
              '',
              '<template>',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; :striped=&quot;true&quot; />',
              '</template>'
            ]"
          >
            <Table :columns="COLUMNS" :data="DATA" row-key="id" striped />
          </ComponentSection>
          <ComponentSection
            title="striped={false} (기본)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '</script>',
              '',
              '<template>',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; />',
              '</template>'
            ]"
          >
            <Table :columns="COLUMNS" :data="DATA" row-key="id" />
          </ComponentSection>
          <ComponentSection
            title="hover — 행 hover 하이라이트"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '</script>',
              '',
              '<template>',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; hover />',
              '</template>'
            ]"
          >
            <Table :columns="COLUMNS" :data="DATA" row-key="id" hover />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'colspan'">
          <ComponentSection
            title="thead colspan — 분기별 매출 현황 (다중 헤더 그룹)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '',
              'const headGroups = [',
              '  [',
              '    { label: \x27제품명\x27, rowSpan: 2 },',
              '    { label: \x27실적\x27, colSpan: 3 },',
              '  ],',
              '  [{ label: \x271분기\x27 }, { label: \x272분기\x27 }, { label: \x273분기\x27 }],',
              ']',
              '</script>',
              '',
              '<template>',
              '  <Table :head-groups=&quot;headGroups&quot; :columns=&quot;columns&quot; :data=&quot;data&quot; />',
              '</template>'
            ]"
            :notes="['headGroups 가 있으면 헤더는 headGroups, 데이터 행은 columns 로 렌더']"
          >
            <Table :head-groups="Q_HEAD" :columns="Q_COLUMNS" :data="QUARTER" row-key="product" />
          </ComponentSection>
          <ComponentSection
            title="tbody colspan — 견적서 (카테고리·소계 행 병합)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {h} from \x27vue\x27',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '',
              'function renderRow(row, i) {',
              '  if (row.type === \x27category\x27)',
              '    return h(\x27tr\x27, { key: i }, [h(\x27td\x27, { colspan: 3 }, row.label)])',
              '  if (row.type === \x27subtotal\x27)',
              '    return h(\x27tr\x27, { key: i }, [h(\x27td\x27, { colspan: 2 }, \x27소계\x27), h(\x27td\x27, {}, row.amount)])',
              '  return null // 기본 렌더로 fallback',
              '}',
              '</script>',
              '',
              '<template>',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; :render-row=&quot;renderRow&quot; />',
              '</template>'
            ]"
            :notes="['renderRow 가 null 을 반환하면 기본 행 렌더로 fallback']"
          >
            <QuoteTable />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'rowspan'">
          <ComponentSection
            title="tbody rowspan — 업무 스케줄 (담당자 자동 병합)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '',
              'const columns = [{ key: \x27owner\x27, label: \x27담당자\x27, rowSpanKey: \x27owner\x27 }]',
              '</script>',
              '',
              '<template>',
              '  &lt;!-- 데이터를 병합 기준 값 순서로 정렬해서 전달 --&gt;',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; row-key=&quot;time&quot; />',
              '</template>'
            ]"
            :notes="['연속된 동일 owner 셀이 rowspan 으로 합쳐집니다']"
          >
            <Table :columns="SCHEDULE_COLUMNS" :data="SCHEDULE" row-key="time" />
          </ComponentSection>
          <ComponentSection
            title="tbody rowspan — 부서별 직원 현황 (그룹 자동 병합)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import Table from \x27m2m-uiux-vue/Table\x27',
              '',
              'const columns = [{ key: \x27dept\x27, label: \x27부서\x27, rowSpanKey: \x27dept\x27 }]',
              '</script>',
              '',
              '<template>',
              '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; row-key=&quot;name&quot; />',
              '</template>'
            ]"
            :notes="['부서 값이 같은 연속 행이 하나의 셀로 병합됩니다']"
          >
            <Table :columns="STAFF_COLUMNS" :data="STAFF" row-key="name" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'empty'"
          title="데이터 없음 — 빈 상태"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;[]&quot; empty-text=&quot;데이터 없음&quot; />',
            '</template>'
          ]"
          :notes="['slot #empty 로 커스텀 노드 지정 가능']"
        >
          <Table :columns="COLUMNS" :data="[]" empty-text="표시할 데이터가 없습니다." />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'loading'"
          title="loading={true} — 로딩 상태"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '',
            'const isLoading = ref(true)',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; :loading=&quot;isLoading&quot; />',
            '</template>'
          ]"
        >
          <Table :columns="COLUMNS" :data="DATA.slice(0, 3)" row-key="id" loading />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'classNames'"
          title="classNames"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import Table from \x27m2m-uiux-vue/Table\x27',
            '</script>',
            '',
            '<template>',
            '  <Table :columns=&quot;columns&quot; :data=&quot;data&quot; class-names=&quot;my-table&quot; />',
            '</template>'
          ]"
        >
          <Table :columns="COLUMNS" :data="DATA.slice(0, 3)" row-key="id" class-names="my-table" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
