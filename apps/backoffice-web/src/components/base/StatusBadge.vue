<template>
  <span
    class="status-badge"
    :class="[`status-badge--variant-${resolvedVariant}`]"
    :aria-label="resolvedLabel || undefined"
    :style="badgeStyle"
  >
    {{ resolvedLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StatusBadgeStatus, StatusBadgeVariant } from './types';

const props = defineProps<{
  label?: string;
  status?: StatusBadgeStatus;
  variant?: StatusBadgeVariant;
}>();

const statusConfig: Record<StatusBadgeStatus, { label: string; variant: StatusBadgeVariant }> = {
  Created: {
    label: 'Создан',
    variant: 'accent',
  },
  Confirmed: {
    label: 'Подтвержден',
    variant: 'success',
  },
  'Ready for pickup': {
    label: 'Готов к выдаче',
    variant: 'warning',
  },
  Rejected: {
    label: 'Отклонен',
    variant: 'destructive',
  },
  Closed: {
    label: 'Закрыт',
    variant: 'neutral',
  },
};

const variantStyles: Record<StatusBadgeVariant, Record<string, string>> = {
  accent: {
    backgroundColor: 'var(--expressa-color-accent-light)',
    color: 'var(--expressa-color-accent)',
  },
  success: {
    backgroundColor: 'var(--expressa-color-success-light)',
    color: 'var(--expressa-color-success)',
  },
  warning: {
    backgroundColor: 'var(--expressa-color-warning-light)',
    color: 'var(--expressa-color-warning)',
  },
  destructive: {
    backgroundColor: 'var(--expressa-color-destructive-light)',
    color: 'var(--expressa-color-destructive)',
  },
  neutral: {
    backgroundColor: 'var(--expressa-color-neutral-light)',
    color: 'var(--expressa-color-neutral)',
  },
};

const resolvedVariant = computed<StatusBadgeVariant>(() => {
  if (props.variant) {
    return props.variant;
  }

  if (props.status) {
    return statusConfig[props.status].variant;
  }

  return 'neutral';
});

const resolvedLabel = computed(() => {
  if (props.label !== undefined) {
    return props.label;
  }

  if (props.status) {
    return statusConfig[props.status].label;
  }

  return '';
});

const badgeStyle = computed(() => ({
  border: '1px solid transparent',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 10px',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '1.4',
  whiteSpace: 'nowrap',
  ...variantStyles[resolvedVariant.value],
}));
</script>

<style scoped lang="scss">
.status-badge {
  font-family: inherit;
}
</style>
