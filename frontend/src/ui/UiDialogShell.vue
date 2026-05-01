<template>
  <v-dialog
    class="app-dialog-shell-overlay"
    :class="{ 'app-dialog-shell-overlay--mobile': isMobile }"
    :model-value="open"
    :max-width="maxWidth"
    :fullscreen="isMobile"
    :transition="dialogTransition"
    @update:model-value="emitModelUpdate"
  >
    <v-card class="app-dialog-shell" :rounded="isMobile ? 't-lg' : 'lg'">
      <div class="app-dialog-shell__header">
        <div class="app-dialog-shell__copy">
          <h2 class="app-dialog-shell__title">{{ title }}</h2>
          <p v-if="description" class="app-dialog-shell__description">
            {{ description }}
          </p>
        </div>

        <div
          v-if="$slots.headerActions"
          class="app-dialog-shell__header-actions"
        >
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
import { computed } from "vue";
import { useDisplay } from "vuetify";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    maxWidth?: number | string;
  }>(),
  {
    description: undefined,
    maxWidth: 480,
  },
);

const emit = defineEmits<{
  close: [];
}>();

const { smAndDown } = useDisplay();
const isMobile = smAndDown;
const dialogTransition = computed(() =>
  isMobile.value ? "dialog-bottom-transition" : "dialog-transition",
);

function emitModelUpdate(value: boolean): void {
  if (!value) {
    emit("close");
  }
}

void props;
</script>

<style scoped lang="scss">
:global(.app-dialog-shell-overlay) {
  align-items: center;
  justify-content: center;
}

:global(
  .app-dialog-shell-overlay:not(.app-dialog-shell-overlay--mobile)
    > .v-overlay__content
    > .app-dialog-shell.v-card
) {
  flex: 0 1 auto;
  width: 100%;
}

.app-dialog-shell {
  background: var(--app-color-background-surface);
  display: flex;
  flex-direction: column;
  max-height: min(90vh, 760px);
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
  padding: 24px 24px 0;
  border-bottom: 1px solid transparent;
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
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
}

.app-dialog-shell__actions {
  flex-direction: column;
  padding: 0 24px 24px;
  border-top: 1px solid transparent;
}

@media (max-width: 959px) {
  .app-dialog-shell {
    margin-top: auto;
    max-height: 90vh;
    border-radius: 16px 16px 0 0 !important;
  }

  .app-dialog-shell__header {
    position: sticky;
    top: 0;
    z-index: 1;
    padding-top: 20px;
    background: var(--app-color-background-surface);
    border-bottom-color: var(--app-color-border);
  }

  .app-dialog-shell__body {
    padding: 20px 24px;
  }

  .app-dialog-shell__actions {
    position: sticky;
    bottom: 0;
    background: var(--app-color-background-surface);
    border-top-color: var(--app-color-border);
    padding-top: 16px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
