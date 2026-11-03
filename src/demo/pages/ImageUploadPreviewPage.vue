<script setup lang="ts">
import ImageUploadPreview from '~/components/ImageUploadPreview'
import UploadedFileList from '~/components/UploadedFileList'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'
import {useServerUpload} from '~/demo/serverUploadDemo'

const TABS = ['basic', 'drag', 'listView', 'cols', 'maxCount', 'maxSize', 'disabled', 'serverUpload']

const MB = 1024 * 1024
const COLS = [2, 3, 4, 5] as const

const {files: uploaded, rejectLog, onPicked, onReject} = useServerUpload()
</script>

<template>
  <div>
    <PageHeader
      title="ImageUploadPreview"
      component="ImageUploadPreview"
      desc="— 이미지를 업로드하고 그리드·리스트·라이트박스로 미리보기까지 한 컴포넌트에서 처리. 드래그 & 드롭, 크기/개수 제한을 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'basic'"
          title="기본 — 그리드 썸네일 + 라이트박스"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
            '</script>',
            '',
            '<template>',
            '  <ImageUploadPreview :max-count=&quot;8&quot; :cols=&quot;4&quot; @change=&quot;(files) => console.log(files)&quot; />',
            '</template>'
          ]"
          :notes="[
            '+ 카드 클릭으로 이미지 추가',
            '썸네일 호버 시 줌 아이콘 + 삭제(×) 버튼',
            '썸네일 클릭 → 라이트박스 (줌/회전/다운로드/키보드 이동)',
            'ESC 또는 배경 클릭으로 닫기'
          ]"
        >
          <ImageUploadPreview :max-count="8" :cols="4" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'drag'"
          title="drag — 드래그 & 드롭 업로드"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
            '</script>',
            '',
            '<template>',
            '  <ImageUploadPreview drag :max-count=&quot;6&quot; :cols=&quot;3&quot; />',
            '</template>'
          ]"
          :notes="['드래그 시 테두리·배경이 오렌지로', 'max-count 도달 시 드롭 영역이 숨겨짐']"
        >
          <ImageUploadPreview drag :max-count="6" :cols="3" />
        </ComponentSection>

        <template v-else-if="tab === 'listView'">
          <ComponentSection
            title="listView — 리스트형 미리보기"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview list-view :max-count=&quot;5&quot; />',
              '</template>'
            ]"
            :notes="['파일명·크기·미리보기/삭제 버튼이 행으로 표시', '크기 초과 파일은 에러 행으로 표시']"
          >
            <ImageUploadPreview list-view :max-count="5" />
          </ComponentSection>
          <ComponentSection
            title="drag + listView"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview drag list-view :max-count=&quot;5&quot; />',
              '</template>'
            ]"
          >
            <ImageUploadPreview drag list-view :max-count="5" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'cols'">
          <ComponentSection
            v-for="c in COLS"
            :key="c"
            :title="`cols={${c}} — ${c}열 그리드`"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              `  <ImageUploadPreview :cols=&quot;${c}&quot; :thumb-size=&quot;80&quot; :max-count=&quot;${c * 2}&quot; />`,
              '</template>'
            ]"
          >
            <ImageUploadPreview :cols="c" :max-count="c * 2" :thumb-size="80" />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'maxCount'">
          <ComponentSection
            title="maxCount — 최대 3장"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview :max-count=&quot;3&quot; />',
              '</template>'
            ]"
            :notes="['도달 시 + 추가 카드가 사라집니다']"
          >
            <ImageUploadPreview :max-count="3" :cols="3" />
          </ComponentSection>
          <ComponentSection
            title="maxCount — 단일 (대표 이미지)"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview :max-count=&quot;1&quot; :thumb-size=&quot;120&quot; />',
              '</template>'
            ]"
          >
            <ImageUploadPreview :max-count="1" :cols="1" :thumb-size="120" />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'maxSize'"
          title="maxSize={1MB} — 초과 시 에러 카드"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
            '</script>',
            '',
            '<template>',
            '  <ImageUploadPreview :max-size=&quot;1 * 1024 * 1024&quot; :max-count=&quot;6&quot; />',
            '</template>'
          ]"
          :notes="['초과 파일은 빨간 에러 카드/행으로 표시, × 삭제 가능']"
        >
          <ImageUploadPreview :max-size="MB" :max-count="6" :cols="3" />
        </ComponentSection>

        <template v-else-if="tab === 'disabled'">
          <ComponentSection
            title="disabled"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview disabled />',
              '</template>'
            ]"
            :notes="['+ 카드가 표시되지 않아 추가 불가']"
          >
            <ImageUploadPreview disabled :max-count="4" :cols="4" />
          </ComponentSection>
          <ComponentSection
            title="disabled + drag"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
              '</script>',
              '',
              '<template>',
              '  <ImageUploadPreview disabled drag />',
              '</template>'
            ]"
          >
            <ImageUploadPreview disabled drag :max-count="4" :cols="3" />
          </ComponentSection>
        </template>
        <!-- ─────────── serverUpload ─────────── -->
        <ComponentSection
          v-else-if="tab === 'serverUpload'"
          title="serverUpload callback — 이미지 선택 후 서버에 올리고, 받은 url 로 썸네일 표시"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import {ref} from \x27vue\x27',
            'import ImageUploadPreview from \x27m2m-uiux-vue/ImageUploadPreview\x27',
            'import UploadedFileList from \x27m2m-uiux-vue/UploadedFileList\x27',
            'import type {UploadedFile} from \x27m2m-uiux-vue/UploadedFileList\x27',
            '',
            'const files = ref<UploadedFile[]>([])',
            '',
            '// 선택 UI 의 change(File[]) → 서버 업로드 → 응답 url 을 v-model 목록에 반영',
            'async function onPicked(picked: File[]) {',
            '  for (const file of picked) {',
            '    const id = crypto.randomUUID()',
            '    files.value.push({id, name: file.name, size: file.size, status: \x27uploading\x27})   // 업로드 중 표시',
            '    try {',
            '      const body = new FormData()',
            '      body.append(\x27file\x27, file)',
            '      const {url} = await (await fetch(\x27/api/upload\x27, {method: \x27POST\x27, body})).json()',
            '      Object.assign(files.value.find((f) => f.id === id)!, {url, status: \x27done\x27})   // url → 썸네일',
            '    } catch {',
            '      Object.assign(files.value.find((f) => f.id === id)!, {status: \x27error\x27, errorMessage: \x27업로드 실패\x27})',
            '    }',
            '  }',
            '}',
            '</script>',
            '',
            '<template>',
            '  <ImageUploadPreview :show-list=&quot;false&quot; @change=&quot;onPicked&quot; />',
            '  <UploadedFileList v-model=&quot;files&quot; />',
            '</template>'
          ]"
          :notes="[
            'serverUpload callback — 선택 UI(:show-list=&quot;false&quot;)의 @change 에서 이번에 고른 File[] 을 서버에 올리고, 응답 url 을 UploadedFileList v-model 에 넣는 흐름',
            '선택 즉시 status=uploading 항목을 추가 → 업로드가 끝나면 url + status=done 으로 채우면 그 정적 경로로 썸네일 표시',
            '실패하면 status=error + errorMessage (데모: 파일명에 fail 포함 시 실패). 크기/개수 제한에 걸린 파일은 @reject 로 전달',
            '썸네일을 누르면 큰 미리보기, 삭제 시 v-model 갱신 + @remove — 서버 삭제 API 는 여기서 호출'
          ]"
        >
          <div class="demo-col">
            <ImageUploadPreview :show-list="false" :max-count="8" @change="onPicked" @reject="onReject" />
            <UploadedFileList v-model="uploaded" />
            <span v-if="rejectLog" class="demo-hint">제외됨: {{ rejectLog }}</span>
          </div>
        </ComponentSection>
      </template>
    </PropTabs>
  </div>
</template>
