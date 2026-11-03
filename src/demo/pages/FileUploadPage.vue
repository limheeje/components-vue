<script setup lang="ts">
import {ref} from 'vue'

import FileUpload, {FILE_UPLOAD_LIST_TYPE} from '~/components/FileUpload'
import UploadedFileList from '~/components/UploadedFileList'

import ComponentSection from '~/demo/components/ComponentSection.vue'
import PageHeader from '~/demo/components/PageHeader.vue'
import PropTabs from '~/demo/components/PropTabs.vue'
import {savedSample, useServerUpload} from '~/demo/serverUploadDemo'

const TABS = ['button', 'drag', 'accept', 'multiple', 'maxSize', 'maxCount', 'disabled', 'listType', 'serverUpload']

const MB = 1024 * 1024

const {files: uploaded, rejectLog, onPicked, onReject} = useServerUpload()
const saved = ref(savedSample())
</script>

<template>
  <div>
    <PageHeader
      title="FileUpload"
      component="FileUpload"
      desc="— 파일을 선택하거나 드래그 & 드롭으로 업로드하는 컴포넌트. 확장자·크기·개수 제한을 지원합니다."
    />
    <PropTabs :tabs="TABS">
      <template #default="{tab}">
        <ComponentSection
          v-if="tab === 'button'"
          title="Button 모드 — 버튼 클릭으로 파일 선택"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
            '</script>',
            '',
            '<template>',
            '  <FileUpload multiple :max-count=&quot;5&quot; @change=&quot;(files) => console.log(files)&quot; />',
            '</template>'
          ]"
          :notes="['파일 선택 후 목록이 표시됩니다', '유효 파일은 @change 로 전달']"
        >
          <FileUpload multiple :max-count="5" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'drag'"
          title='Drag & Drop 모드 — :drag="true"'
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
            '</script>',
            '',
            '<template>',
            '  <FileUpload drag multiple :max-size=&quot;10 * 1024 * 1024&quot; />',
            '</template>'
          ]"
          :notes="['드래그 시 영역 색이 변합니다', '클릭으로도 파일 선택 가능']"
        >
          <FileUpload drag multiple :max-size="10 * MB" />
        </ComponentSection>

        <template v-else-if="tab === 'accept'">
          <ComponentSection
            title='accept="image/*" — 이미지만 (listType="picture")'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import FileUpload, {FILE_UPLOAD_LIST_TYPE} from \x27m2m-uiux-vue/FileUpload\x27`,
              '</script>',
              '',
              '<template>',
              '  <FileUpload accept=&quot;image/*&quot; multiple :list-type=&quot;FILE_UPLOAD_LIST_TYPE[\x27PICTURE\x27]&quot; />',
              '</template>'
            ]"
          >
            <FileUpload accept="image/*" multiple :list-type="FILE_UPLOAD_LIST_TYPE['PICTURE']" />
          </ComponentSection>
          <ComponentSection
            title='accept=".pdf,.doc,.docx" — 문서만'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
              '</script>',
              '',
              '<template>',
              '  <FileUpload accept=&quot;.pdf,.doc,.docx&quot; multiple />',
              '</template>'
            ]"
          >
            <FileUpload accept=".pdf,.doc,.docx" multiple />
          </ComponentSection>
        </template>

        <template v-else-if="tab === 'multiple'">
          <ComponentSection
            title="multiple — 여러 파일 선택"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
              '</script>',
              '',
              '<template>',
              '  <FileUpload multiple :max-count=&quot;5&quot; />',
              '</template>'
            ]"
          >
            <FileUpload multiple :max-count="5" />
          </ComponentSection>
          <ComponentSection
            title="multiple 없음 (기본) — 단일 파일"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
              '</script>',
              '',
              '<template>',
              '  <FileUpload />',
              '</template>'
            ]"
            :notes="['단일 모드는 새 파일 선택 시 이전 파일 교체']"
          >
            <FileUpload />
          </ComponentSection>
        </template>

        <ComponentSection
          v-else-if="tab === 'maxSize'"
          title="maxSize={1MB} — 초과 파일은 에러 항목"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
            '</script>',
            '',
            '<template>',
            '  <FileUpload multiple :max-size=&quot;1 * 1024 * 1024&quot; />',
            '</template>'
          ]"
          :notes="['초과 파일은 목록에 빨간 에러 상태로 표시됩니다']"
        >
          <FileUpload multiple :max-size="MB" :max-count="5" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'maxCount'"
          title="maxCount — 최대 3개"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
            '</script>',
            '',
            '<template>',
            '  <FileUpload multiple :max-count=&quot;3&quot; />',
            '</template>'
          ]"
          :notes="['max-count 도달 시 버튼이 비활성화됩니다']"
        >
          <FileUpload multiple :max-count="3" />
        </ComponentSection>

        <ComponentSection
          v-else-if="tab === 'disabled'"
          title="disabled"
          :code="[
            '<script setup lang=&quot;ts&quot;>',
            'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
            '</script>',
            '',
            '<template>',
            '  <FileUpload disabled />',
            '</template>'
          ]"
          :notes="['버튼 클릭 및 드래그 모두 차단됩니다']"
        >
          <FileUpload disabled />
        </ComponentSection>

        <template v-else-if="tab === 'listType'">
          <ComponentSection
            title='list-type="text" (기본) — 파일명 텍스트'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import FileUpload, {FILE_UPLOAD_LIST_TYPE} from \x27m2m-uiux-vue/FileUpload\x27`,
              '</script>',
              '',
              '<template>',
              '  <FileUpload multiple :list-type=&quot;FILE_UPLOAD_LIST_TYPE[\x27TEXT\x27]&quot; />',
              '</template>'
            ]"
          >
            <FileUpload multiple :max-count="4" :list-type="FILE_UPLOAD_LIST_TYPE['TEXT']" />
          </ComponentSection>
          <ComponentSection
            title='list-type="picture" — 이미지 썸네일'
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              `import FileUpload, {FILE_UPLOAD_LIST_TYPE} from \x27m2m-uiux-vue/FileUpload\x27`,
              '</script>',
              '',
              '<template>',
              '  <FileUpload accept=&quot;image/*&quot; multiple :list-type=&quot;FILE_UPLOAD_LIST_TYPE[\x27PICTURE\x27]&quot; />',
              '</template>'
            ]"
            :notes="['이미지 파일 선택 시 36×36 썸네일 미리보기']"
          >
            <FileUpload accept="image/*" multiple :max-count="4" :list-type="FILE_UPLOAD_LIST_TYPE['PICTURE']" />
          </ComponentSection>
        </template>
        <!-- ─────────── serverUpload ─────────── -->
        <template v-else-if="tab === 'serverUpload'">
          <ComponentSection
            title="serverUpload callback — 파일 선택 후 서버에 올리고, 받은 url 로 썸네일 표시"
            :code="[
              '<script setup lang=&quot;ts&quot;>',
              'import {ref} from \x27vue\x27',
              'import FileUpload from \x27m2m-uiux-vue/FileUpload\x27',
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
              '  <FileUpload multiple accept=&quot;image/*&quot; :show-list=&quot;false&quot; @change=&quot;onPicked&quot; />',
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
              <FileUpload multiple accept="image/*" :show-list="false" @change="onPicked" @reject="onReject" />
              <UploadedFileList v-model="uploaded" />
              <span v-if="rejectLog" class="demo-hint">제외됨: {{ rejectLog }}</span>
            </div>
          </ComponentSection>
          <ComponentSection
            title="이미 서버에 있는 파일 — url(정적 경로)만 넘기면 썸네일 표시"
            :code="[
              'const files = ref<UploadedFile[]>([',
              '  {name: \x27banner.png\x27, url: \x27https://cdn.example.com/files/banner.png\x27, size: 183000}',
              '])',
              '',
              '<UploadedFileList v-model=&quot;files&quot; />'
            ]"
            :notes="['이미지가 아니면 파일 아이콘, 서버 이미지 로딩 실패 시에도 아이콘으로 대체']"
          >
            <UploadedFileList v-model="saved" />
          </ComponentSection>
        </template>
      </template>
    </PropTabs>
  </div>
</template>
