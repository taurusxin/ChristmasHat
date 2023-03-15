<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useOsTheme, darkTheme, type UploadFileInfo } from 'naive-ui'

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : undefined))
</script>

<template>
  <n-config-provider :theme="theme">
    <RouterView />
  </n-config-provider>
</template>

<style scoped></style>
