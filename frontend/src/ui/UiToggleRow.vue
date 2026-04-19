<template>
  <v-sheet class="app-toggle-row" rounded="lg" border>
    <span class="app-toggle-row__copy">
      <strong>{{ label }}</strong>
      <small v-if="description">{{ description }}</small>
    </span>
    <v-switch
      :model-value="modelValue"
      color="primary"
      density="comfortable"
      hide-details
      inset
      @update:model-value="emit('update:modelValue', Boolean($event))"
    />
  </v-sheet>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
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
  padding: 14px 16px;
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
