<template>
  <v-dialog
    :max-width="maxWidth"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="menu-dialog-shell" rounded="xl">
      <div class="menu-dialog-shell__body">
        <MenuSectionHeader :label="label" :text="text" :title="title" />
        <div class="menu-dialog-shell__content">
          <slot />
        </div>
      </div>

      <div v-if="$slots.actions" class="menu-dialog-shell__actions">
        <slot name="actions" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import MenuSectionHeader from './MenuSectionHeader.vue';

withDefaults(
  defineProps<{
    label: string;
    maxWidth?: number | string;
    modelValue: boolean;
    text?: string;
    title: string;
  }>(),
  {
    maxWidth: 520,
    text: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped lang="scss">
.menu-dialog-shell {
  border: 1px solid var(--expressa-border);
  background: var(--expressa-menu-surface);
  box-shadow: var(--expressa-menu-shadow-card);

  &__body {
    display: grid;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0;
  }

  &__content {
    display: grid;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 1rem 1.25rem 1.25rem;
  }
}
</style>
