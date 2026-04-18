<template>
  <div class="toggle-row" data-testid="toggle-row">
    <div class="toggle-row__content">
      <span class="toggle-row__label">{{ label }}</span>
      <span v-if="sublabel" class="toggle-row__sublabel">{{ sublabel }}</span>
    </div>

    <v-switch
      class="toggle-row__switch"
      :aria-label="label"
      :disabled="disabled"
      :model-value="modelValue"
      color="primary"
      density="compact"
      hide-details
      inset
      @update:modelValue="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean;
    label: string;
    modelValue: boolean;
    sublabel?: string;
  }>(),
  {
    disabled: false,
    sublabel: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function handleUpdate(value: boolean | null) {
  emit('update:modelValue', Boolean(value));
}
</script>

<style scoped lang="scss">
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.toggle-row__content {
  display: grid;
  gap: 0.125rem;
  min-width: 0;
}

.toggle-row__label {
  color: var(--expressa-text);
  font-weight: 700;
  line-height: 1.4;
}

.toggle-row__sublabel {
  color: var(--expressa-secondary);
  line-height: 1.5;
}

.toggle-row__switch {
  flex: none;
}
</style>
