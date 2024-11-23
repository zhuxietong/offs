<template>
  <view>
    <text>{{ pageIndex }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pageIndex = ref('OK');
</script>

<style scoped></style>
