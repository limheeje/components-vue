<script setup lang="ts">
import CodeBlock from '~/demo/components/CodeBlock.vue'

defineProps<{
  title: string
  description?: string
  code: string | string[]
  notes?: string[]
}>()
</script>

<template>
  <section class="demo-section">
    <div class="demo-section__head">
      <span class="demo-section__title">{{ title }}</span>
      <span v-if="description != null" class="demo-section__desc">{{ description }}</span>
    </div>
    <div class="demo-section__preview"><slot /></div>
    <CodeBlock :code="code" />
    <ul v-if="notes != null && notes.length > 0" class="demo-section__notes">
      <li v-for="note in notes" :key="note">{{ note }}</li>
    </ul>
  </section>
</template>
