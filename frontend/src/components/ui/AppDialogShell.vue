<template>
  <v-dialog :model-value="open" :max-width="maxWidth" @update:model-value="emitModelUpdate">
    <v-card class="app-dialog-shell" rounded="lg">
      <div class="app-dialog-shell__header">
        <div class="app-dialog-shell__copy">
          <h2 class="app-dialog-shell__title">{{ title }}</h2>
          <p v-if="description" class="app-dialog-shell__description">{{ description }}</p>
        </div>

        <div v-if="$slots.headerActions" class="app-dialog-shell__header-actions">
          <slot name="headerActions" />
        </div>
      </div>

      <div class="app-dialog-shell__body">
        <slot />
      </div>

      <div v-if="$slots.actions" class="app-dialog-shell__actions">
        <slot name="actions" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    maxWidth?: number | string;
  }>(),
  {
    description: undefined,
    maxWidth: 480
  }
);

const emit = defineEmits<{
  close: [];
}>();

function emitModelUpdate(value: boolean): void {
  if (!value) {
    emit("close");
  }
}

void props;
</script>

<style scoped lang="scss">
.app-dialog-shell {
  padding: 24px;
  background: var(--app-color-background-surface);
}

.app-dialog-shell__header,
.app-dialog-shell__header-actions,
.app-dialog-shell__actions {
  display: flex;
  gap: 12px;
}

.app-dialog-shell__header {
  align-items: flex-start;
  justify-content: space-between;
}

.app-dialog-shell__copy {
  min-width: 0;
}

.app-dialog-shell__title {
  margin: 0;
  color: var(--app-color-text-primary);
}

.app-dialog-shell__description {
  margin: 4px 0 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 20px;
}

.app-dialog-shell__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}

.app-dialog-shell__actions {
  flex-direction: column;
  padding-top: 24px;
}
</style>
