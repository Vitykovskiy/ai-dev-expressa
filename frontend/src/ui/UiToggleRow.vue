<template>
  <div class="app-toggle-row" :class="{ 'app-toggle-row--disabled': disabled }">
    <span class="app-toggle-row__copy">
      <strong>{{ label }}</strong>
      <small v-if="description">{{ description }}</small>
    </span>
    <v-switch
      :model-value="modelValue"
      color="primary"
      density="comfortable"
      :disabled="disabled"
      hide-details
      inset
      @update:model-value="emit('update:modelValue', Boolean($event))"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

void props;
</script>

<style scoped lang="scss">
.app-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--app-color-border);
}

.app-toggle-row:last-child {
  border-bottom: 0;
}

.app-toggle-row--disabled {
  opacity: 0.72;
}

.app-toggle-row__copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.app-toggle-row__copy strong {
  color: var(--app-color-text-primary);
}

.app-toggle-row__copy small {
  color: var(--app-color-text-muted);
  font-size: 12px;
}
</style>
