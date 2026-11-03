<script setup lang="ts">
defineProps<{
  title: string
  component?: string
  desc: string
}>()
</script>

<template>
  <header class="demo-page-header">
    <h2 class="demo-page-header__title">{{ title }}</h2>
    <div class="demo-page-header__meta">
      <code v-if="component != null" class="demo-page-header__chip">{{ component }}</code>
      <span class="demo-page-header__desc">{{ desc }}</span>
    </div>
  </header>
</template>
