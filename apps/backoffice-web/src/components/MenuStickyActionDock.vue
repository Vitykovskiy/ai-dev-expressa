<template>
  <div
    class="menu-sticky-dock"
    :class="[
      `menu-sticky-dock--${placement}`,
      { 'menu-sticky-dock--contentless': !hasContent },
    ]"
  >
    <MenuSurfaceCard class="menu-sticky-dock__surface" :variant="variant">
      <div v-if="hasContent" class="menu-sticky-dock__content">
        <slot name="content" />
      </div>

      <div class="menu-sticky-dock__actions">
        <slot name="actions" />
      </div>
    </MenuSurfaceCard>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';

withDefaults(
  defineProps<{
    placement?: 'top' | 'bottom';
    variant?: 'default' | 'hero' | 'subtle' | 'warning' | 'danger';
  }>(),
  {
    placement: 'bottom',
    variant: 'subtle',
  },
);

const slots = useSlots();
const hasContent = computed(() => slots.content !== undefined);
</script>

<style scoped lang="scss">
.menu-sticky-dock {
  position: sticky;
  z-index: 8;

  &--top {
    top: 1rem;
  }

  &--bottom {
    bottom: 1rem;
  }

  &__surface {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    backdrop-filter: blur(16px);
    box-shadow: var(--expressa-menu-shadow-card);
  }

  &__content {
    min-width: 0;
    display: grid;
    gap: 0.75rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
    align-items: center;
  }

  &--contentless &__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 759px) {
  .menu-sticky-dock {
    &__actions:deep(.v-btn) {
      flex: 1 1 100%;
    }

    &--contentless &__actions {
      justify-content: flex-start;
    }
  }
}

@media (min-width: 760px) {
  .menu-sticky-dock {
    &__surface {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
    }

    &--contentless &__surface {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
