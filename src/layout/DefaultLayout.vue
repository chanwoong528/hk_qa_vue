<script lang="ts" setup>
// import AppHeader from "@/components/AppHeader.vue";
</script>
<template>
  <main class="main-layout">
    <!-- <AppHeader /> -->
    <slot></slot>
  </main>
</template>
<style lang="scss" scoped>
.main-layout {
  padding: 20px 32px 60px;
  max-width: 1920px;
  min-width: 1400px;
}
</style>
