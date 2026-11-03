import type {Component} from 'vue'

import AccordionPage from '~/demo/pages/AccordionPage.vue'
import BadgePage from '~/demo/pages/BadgePage.vue'
import BreadcrumbPage from '~/demo/pages/BreadcrumbPage.vue'
import ButtonGroupPage from '~/demo/pages/ButtonGroupPage.vue'
import ButtonPage from '~/demo/pages/ButtonPage.vue'
import CascaderPage from '~/demo/pages/CascaderPage.vue'
import ChartPage from '~/demo/pages/ChartPage.vue'
import CheckboxGroupPage from '~/demo/pages/CheckboxGroupPage.vue'
import CheckboxPage from '~/demo/pages/CheckboxPage.vue'
import DatePickerPage from '~/demo/pages/DatePickerPage.vue'
import DialogPage from '~/demo/pages/DialogPage.vue'
import DividerPage from '~/demo/pages/DividerPage.vue'
import FileUploadPage from '~/demo/pages/FileUploadPage.vue'
import FilterPage from '~/demo/pages/FilterPage.vue'
import FormPage from '~/demo/pages/FormPage.vue'
import GridPage from '~/demo/pages/GridPage.vue'
import HeaderPage from '~/demo/pages/HeaderPage.vue'
import HomePage from '~/demo/pages/HomePage.vue'
import IconPage from '~/demo/pages/IconPage.vue'
import ImagePage from '~/demo/pages/ImagePage.vue'
import ImagePreviewPage from '~/demo/pages/ImagePreviewPage.vue'
import ImageUploadPreviewPage from '~/demo/pages/ImageUploadPreviewPage.vue'
import InputPage from '~/demo/pages/InputPage.vue'
import ListPage from '~/demo/pages/ListPage.vue'
import LoadingPage from '~/demo/pages/LoadingPage.vue'
import NoDataPage from '~/demo/pages/NoDataPage.vue'
import PaginationPage from '~/demo/pages/PaginationPage.vue'
import ProgressBarPage from '~/demo/pages/ProgressBarPage.vue'
import RadioGroupPage from '~/demo/pages/RadioGroupPage.vue'
import RadioPage from '~/demo/pages/RadioPage.vue'
import RegionPickerPage from '~/demo/pages/RegionPickerPage.vue'
import SearchFieldPage from '~/demo/pages/SearchFieldPage.vue'
import SegmentedPage from '~/demo/pages/SegmentedPage.vue'
import SelectPage from '~/demo/pages/SelectPage.vue'
import ShareSheetPage from '~/demo/pages/ShareSheetPage.vue'
import StepsPage from '~/demo/pages/StepsPage.vue'
import SwiperPage from '~/demo/pages/SwiperPage.vue'
import SwitchPage from '~/demo/pages/SwitchPage.vue'
import TablePage from '~/demo/pages/TablePage.vue'
import TabsPage from '~/demo/pages/TabsPage.vue'
import TextareaPage from '~/demo/pages/TextareaPage.vue'
import TimePickerPage from '~/demo/pages/TimePickerPage.vue'
import TimelinePage from '~/demo/pages/TimelinePage.vue'
import ToastPage from '~/demo/pages/ToastPage.vue'
import TokenPage from '~/demo/pages/TokenPage.vue'
import TooltipPage from '~/demo/pages/TooltipPage.vue'

export interface PageMeta {
  /** 페이지 고유 키 (라우팅 식별자) */
  key: string
  /** 코드 예시에 노출되는 컴포넌트명 */
  component: string
  Page: Component
}

/** 페이지 레지스트리 (key → 페이지 컴포넌트) */
export const PAGES = [
  {key: 'Home', component: 'Home', Page: HomePage},
  {key: 'Icon', component: 'Icon', Page: IconPage},
  {key: 'Token', component: 'Token', Page: TokenPage},
  {key: 'Image', component: 'Image', Page: ImagePage},
  {key: 'Grid', component: 'Grid', Page: GridPage},
  {key: 'Header', component: 'Header', Page: HeaderPage},
  {key: 'Divider', component: 'Divider', Page: DividerPage},
  {key: 'Tabs', component: 'Tabs', Page: TabsPage},
  {key: 'Segmented', component: 'Segmented', Page: SegmentedPage},
  {key: 'Breadcrumb', component: 'Breadcrumb', Page: BreadcrumbPage},
  {key: 'Button', component: 'Button', Page: ButtonPage},
  {key: 'ButtonGroup', component: 'ButtonGroup', Page: ButtonGroupPage},
  {key: 'Input', component: 'Input', Page: InputPage},
  {key: 'Select', component: 'Select', Page: SelectPage},
  {key: 'Cascader', component: 'Cascader', Page: CascaderPage},
  {key: 'Checkbox', component: 'Checkbox', Page: CheckboxPage},
  {key: 'CheckboxGroup', component: 'CheckboxGroup', Page: CheckboxGroupPage},
  {key: 'Radio', component: 'Radio', Page: RadioPage},
  {key: 'RadioGroup', component: 'RadioGroup', Page: RadioGroupPage},
  {key: 'Switch', component: 'Switch', Page: SwitchPage},
  {key: 'Textarea', component: 'Textarea', Page: TextareaPage},
  {key: 'SearchField', component: 'SearchField', Page: SearchFieldPage},
  {key: 'DatePicker', component: 'DatePicker', Page: DatePickerPage},
  {key: 'TimePicker', component: 'TimePicker', Page: TimePickerPage},
  {key: 'FileUpload', component: 'FileUpload', Page: FileUploadPage},
  {key: 'ImageUploadPreview', component: 'ImageUploadPreview', Page: ImageUploadPreviewPage},
  {key: 'Form', component: 'Form', Page: FormPage},
  {key: 'RegionPicker', component: 'RegionPicker', Page: RegionPickerPage},
  {key: 'Filter', component: 'Filter', Page: FilterPage},
  {key: 'Badge', component: 'Badge', Page: BadgePage},
  {key: 'Table', component: 'Table', Page: TablePage},
  {key: 'List', component: 'List', Page: ListPage},
  {key: 'Accordion', component: 'Accordion', Page: AccordionPage},
  {key: 'NoData', component: 'NoData', Page: NoDataPage},
  {key: 'Timeline', component: 'Timeline', Page: TimelinePage},
  {key: 'Swiper', component: 'Swiper', Page: SwiperPage},
  {key: 'ImagePreview', component: 'ImagePreview', Page: ImagePreviewPage},
  {key: 'Pagination', component: 'Pagination', Page: PaginationPage},
  {key: 'Chart', component: 'Chart', Page: ChartPage},
  {key: 'Dialog', component: 'Dialog', Page: DialogPage},
  {key: 'ShareSheet', component: 'ShareSheet', Page: ShareSheetPage},
  {key: 'Toast', component: 'Toast', Page: ToastPage},
  {key: 'Tooltip', component: 'Tooltip', Page: TooltipPage},
  {key: 'Loading', component: 'Loading', Page: LoadingPage},
  {key: 'ProgressBar', component: 'ProgressBar', Page: ProgressBarPage},
  {key: 'Steps', component: 'Steps', Page: StepsPage}
] as const satisfies readonly PageMeta[]

export type PageKey = (typeof PAGES)[number]['key']

/** 사이드바 항목 — leaf(key) 또는 collapsible(children) */
export interface NavChild {
  label: string
  key: PageKey
  /** 열 때 미리 선택할 PropTabs 탭 */
  tab?: string
}
export interface NavItem {
  label: string
  key?: PageKey
  tab?: string
  /** 데모 사이드바 아이콘 키 (NavIcon) */
  icon?: string
  children?: NavChild[]
}
export interface NavGroup {
  label: string
  color: string
  items: NavItem[]
}

/**
 * 원본 데모 앱 `src/demo/pages/index.ts` (React) 의 `NAV_GROUPS` 와 동일한 트리.
 * 그룹 순서 / 라벨 / 중첩까지 일치.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Foundation',
    color: '#023894',
    items: [
      {label: 'Token', key: 'Token', icon: 'hash'},
      {label: 'SvgIcon', key: 'Icon', icon: 'shapes'},
      {label: 'Image', key: 'Image', icon: 'image'}
    ]
  },
  {
    label: 'Layout',
    color: '#6366F1',
    items: [
      {label: 'Grid', key: 'Grid', icon: 'layout-grid'},
      {label: 'Header', key: 'Header', icon: 'panel-top'},
      {label: 'Divider', key: 'Divider', icon: 'minus'},
      {label: 'Tab', key: 'Tabs', icon: 'tabs'},
      {label: 'Segmented', key: 'Segmented', icon: 'toggle'},
      {label: 'Breadcrumb', key: 'Breadcrumb', icon: 'breadcrumb'}
    ]
  },
  {
    label: 'Action',
    color: '#3B82F6',
    items: [
      {label: 'Button', key: 'Button', icon: 'button'},
      {label: 'ButtonGroup', key: 'ButtonGroup', icon: 'layout-grid'}
    ]
  },
  {
    label: 'Form',
    color: '#8B5CF6',
    items: [
      {
        label: 'Input',
        key: 'Input',
        icon: 'text-input',
        children: [
          {label: 'Text', key: 'Input', tab: 'Text'},
          {label: 'Password', key: 'Input', tab: 'Password'},
          {label: 'Number', key: 'Input', tab: 'Number'},
          {label: 'Email', key: 'Input', tab: 'Email'},
          {label: 'Tel', key: 'Input', tab: 'Tel'},
          {label: 'Search', key: 'Input', tab: 'Search'}
        ]
      },
      {
        label: 'Select',
        key: 'Select',
        icon: 'chevron-down',
        children: [
          {label: 'Default', key: 'Select', tab: 'Default'},
          {label: 'Multi', key: 'Select', tab: 'Multi'}
        ]
      },
      {label: 'Cascader', key: 'Cascader', icon: 'layers'},
      {label: 'Checkbox', key: 'Checkbox', icon: 'check-square'},
      {label: 'CheckboxGroup', key: 'CheckboxGroup', icon: 'check-square'},
      {label: 'Radio', key: 'Radio', icon: 'radio'},
      {label: 'RadioGroup', key: 'RadioGroup', icon: 'radio'},
      {label: 'Switch', key: 'Switch', icon: 'toggle'},
      {label: 'Textarea', key: 'Textarea', icon: 'align-left'},
      {label: 'SearchField', key: 'SearchField', icon: 'search'},
      {label: 'DatePicker', key: 'DatePicker', icon: 'calendar'},
      {label: 'TimePicker', key: 'TimePicker', icon: 'clock'},
      {label: 'FileUpload', key: 'FileUpload', icon: 'upload'},
      {label: 'ImageUploadPreview', key: 'ImageUploadPreview', icon: 'image'},
      {label: 'Form', key: 'Form', icon: 'file-text'},
      {label: 'RegionPicker', key: 'RegionPicker', icon: 'map-pin'},
      {label: 'Filter', key: 'Filter', icon: 'filter'}
    ]
  },
  {
    label: 'Data Display',
    color: '#059669',
    items: [
      {label: 'Badge', key: 'Badge', icon: 'tag'},
      {label: 'Table', key: 'Table', icon: 'table'},
      {label: 'List', key: 'List', icon: 'list'},
      {label: 'Accordion', key: 'Accordion', icon: 'layers'},
      {label: 'NoData', key: 'NoData', icon: 'inbox'},
      {label: 'Timeline', key: 'Timeline', icon: 'git-commit'},
      {label: 'Swiper', key: 'Swiper', icon: 'gallery'},
      {label: 'ImagePreview', key: 'ImagePreview', icon: 'image'},
      {label: 'Pagination', key: 'Pagination', icon: 'list'},
      {label: 'Chart', key: 'Chart', icon: 'line-chart'}
    ]
  },
  {
    label: 'Feedback',
    color: '#EF4444',
    items: [
      {label: 'Dialog', key: 'Dialog', icon: 'message-circle'},
      {label: 'ShareSheet', key: 'ShareSheet', icon: 'share-2'},
      {label: 'Toast', key: 'Toast', icon: 'bell'},
      {label: 'Tooltip', key: 'Tooltip', icon: 'message-circle'},
      {label: 'Loading', key: 'Loading', icon: 'loader'},
      {
        label: 'Progress',
        key: 'ProgressBar',
        icon: 'bar-chart',
        children: [
          {label: 'Bar', key: 'ProgressBar'},
          {label: 'Steps', key: 'Steps'}
        ]
      }
    ]
  }
]

/** key → 소속 그룹 메타 (topbar 브레드크럼용) */
export function groupOf(key: PageKey): {label: string; color: string} {
  for (const g of NAV_GROUPS) {
    for (const item of g.items) {
      if (item.key === key || item.children?.some((c) => c.key === key)) {
        return {label: g.label, color: g.color}
      }
    }
  }
  return {label: '', color: '#888'}
}
