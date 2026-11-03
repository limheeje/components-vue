<script setup lang="ts">
import ImagePreview, {IMAGE_PREVIEW_FIT} from '~/components/ImagePreview'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'

const TABS = ['preview', 'group', 'size', 'radius', 'fit', 'fallback']

const IMGS = [
  'https://picsum.photos/id/1015/500/400',
  'https://picsum.photos/id/1025/500/400',
  'https://picsum.photos/id/1039/500/400',
  'https://picsum.photos/id/1043/500/400',
  'https://picsum.photos/id/1050/500/400',
  'https://picsum.photos/id/1060/500/400'
]

const SIZES = [60, 100, 150] as const
const RADII = [0, 8, 16, 999]
// 하드코딩 문자열 대신 export 상수(IMAGE_PREVIEW_FIT) 키로 관리
const FITS: (keyof typeof IMAGE_PREVIEW_FIT)[] = ['COVER', 'CONTAIN', 'FILL']
</script>

<template>
  <div>
    <PageHeader
      title="ImagePreview"
      component="ImagePreview"
      desc="— 이미지 클릭 시 라이트박스(Lightbox)로 확대 미리보기. 갤러리 그룹·줌·회전·썸네일 스트립 지원."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <template v-if="tab === 'preview'">
          <ComponentSection
            title="preview={true} (기본) — 클릭 시 라이트박스 열림"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImagePreview :src=&quot;url&quot; :width=&quot;120&quot; :height=&quot;120&quot; />',
              '</template>'
            ]"
            :notes="[
              '클릭 → 라이트박스',
              '라이트박스 내 줌 인/아웃, 90° 회전, 다운로드 지원',
              'ESC 키 또는 배경 클릭으로 닫기'
            ]"
          >
            <div class="demo-row" style="gap: 12px; flex-wrap: wrap">
              <ImagePreview v-for="s in IMGS.slice(0, 3)" :key="s" :src="s" :width="100" :height="100" />
            </div>
          </ComponentSection>
          <ComponentSection
            title="preview={false} — 라이트박스 비활성"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImagePreview :src=&quot;url&quot; :preview=&quot;false&quot; />',
              '</template>'
            ]"
            :notes="['클릭해도 라이트박스가 열리지 않습니다']"
          >
            <ImagePreview :src="IMGS[0]" :width="120" :height="120" :preview="false" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'group'"
          title="group — 갤러리 묶음 (라이트박스 내 이동)"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
            '',
            'const images = [\x27/a.jpg\x27, \x27/b.jpg\x27, \x27/c.jpg\x27]',
            '</script>',
            '',
            '<template>',
            '  <ImagePreview',
            '    v-for=&quot;src in images&quot;',
            '    :key=&quot;src&quot;',
            '    :src=&quot;src&quot;',
            '    :group=&quot;images&quot;',
            '    width=&quot;100%&quot;',
            '    :height=&quot;100&quot;',
            '  />',
            '</template>'
          ]"
          :notes="[
            '같은 group 배열을 공유하는 이미지들은 라이트박스 내에서 ← → 이동 가능',
            '하단 썸네일 스트립으로 빠른 이동',
            '키보드 ArrowLeft/Right 로도 이동'
          ]"
        >
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 420px">
            <ImagePreview v-for="s in IMGS" :key="s" :src="s" :group="IMGS" width="100%" :height="100" />
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'size'"
          title="width / height — 픽셀 또는 CSS 문자열"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
            '</script>',
            '',
            '<template>',
            '  <ImagePreview :src=&quot;url&quot; :width=&quot;60&quot; :height=&quot;60&quot; />',
            '  <ImagePreview :src=&quot;url&quot; :width=&quot;100&quot; :height=&quot;100&quot; />',
            '  <ImagePreview :src=&quot;url&quot; width=&quot;100%&quot; :height=&quot;200&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-row" style="gap: 12px; align-items: flex-end">
            <div v-for="w in SIZES" :key="w" style="text-align: center">
              <ImagePreview :src="IMGS[0]" :width="w" :height="100" />
              <div class="demo-hint">{{ w }}×100</div>
            </div>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'radius'"
          title="radius — 모서리 둥글기"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
            '</script>',
            '',
            '<template>',
            '  &lt;!-- radius=0: 직각 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :radius=&quot;0&quot; />',
            '  &lt;!-- radius=8: 기본값 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :radius=&quot;8&quot; />',
            '  &lt;!-- radius=999: 원형 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :radius=&quot;999&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-row" style="gap: 16px">
            <div v-for="r in RADII" :key="r" style="text-align: center">
              <ImagePreview :src="IMGS[1]" :width="80" :height="80" :radius="r" />
              <div class="demo-hint">radius={{ r }}</div>
            </div>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'fit'"
          title="fit — 이미지 채우기 방식"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            `import ImagePreview, {IMAGE_PREVIEW_FIT} from \x27m2m-uiux-vue/ImagePreview\x27`,
            '</script>',
            '',
            '<template>',
            '  &lt;!-- COVER: 기본, 비율 유지 + 잘림 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :fit=&quot;IMAGE_PREVIEW_FIT[\x27COVER\x27]&quot; />',
            '  &lt;!-- CONTAIN: 비율 유지 + 여백 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :fit=&quot;IMAGE_PREVIEW_FIT[\x27CONTAIN\x27]&quot; />',
            '  &lt;!-- FILL: 비율 무시 + 가득 채움 --&gt;',
            '  <ImagePreview :src=&quot;url&quot; :fit=&quot;IMAGE_PREVIEW_FIT[\x27FILL\x27]&quot; />',
            '</template>'
          ]"
        >
          <div class="demo-row" style="gap: 16px">
            <div v-for="f in FITS" :key="f" style="text-align: center">
              <ImagePreview :src="IMGS[2]" :width="110" :height="80" :fit="IMAGE_PREVIEW_FIT[f]" :radius="6" />
              <div class="demo-hint">fit="{{ IMAGE_PREVIEW_FIT[f] }}"</div>
            </div>
          </div>
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'fallback'"
          title="fallback — 이미지 로드 실패 시 대체 이미지"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImagePreview from \x27m2m-uiux-vue/ImagePreview\x27',
            '</script>',
            '',
            '<template>',
            '  <ImagePreview',
            '    src=&quot;https://broken-url.xyz/img.jpg&quot;',
            '    fallback=&quot;/images/placeholder.png&quot;',
            '    :width=&quot;100&quot;',
            '    :height=&quot;100&quot;',
            '  />',
            '</template>'
          ]"
          :notes="['이미지 로드 실패 시 fallback URL 의 이미지가 대신 표시됩니다']"
        >
          <ImagePreview src="https://invalid.invalid/x.jpg" :fallback="IMGS[0]" :width="120" :height="120" />
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
