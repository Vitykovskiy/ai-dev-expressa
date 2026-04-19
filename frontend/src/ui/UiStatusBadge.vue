<template>
  <span class="app-status-badge" :style="badgeStyle">
    <slot>{{ value }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveStatusBadgeVariant, type AppStatusBadgeVariant } from "./contracts";

const props = defineProps<{
  value: AppStatusBadgeVariant;
}>();

const badgeStyle = computed(() => resolveStatusBadgeVariant(props.value));
</script>

<style scoped lang="scss">
.app-status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 10px;
  border-radius: var(--app-radius-pill);
  font-size: 12px;
  line-height: 16px;
}
</style>
