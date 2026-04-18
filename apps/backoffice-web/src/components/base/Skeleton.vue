<template>
  <div
    class="base-skeleton"
    :class="[`base-skeleton--${variant}`, { 'base-skeleton--animated': animated }]"
    :data-testid="testId"
    aria-hidden="true"
  >
    <template v-if="variant === 'card'">
      <div class="base-skeleton__card-header">
        <span class="base-skeleton__line base-skeleton__line--title" />
        <span class="base-skeleton__pill" />
      </div>

      <div class="base-skeleton__stack">
        <span
          v-for="(width, index) in resolvedLineWidths"
          :key="`card-line-${index}`"
          class="base-skeleton__line"
          :style="{ width }"
        />
      </div>

      <div class="base-skeleton__card-footer">
        <span class="base-skeleton__button" />
        <span class="base-skeleton__button" />
      </div>
    </template>

    <template v-else-if="variant === 'list-row'">
      <span v-if="showAvatar" class="base-skeleton__avatar" />

      <div class="base-skeleton__row-content">
        <span
          v-for="(width, index) in resolvedLineWidths"
          :key="`row-line-${index}`"
          class="base-skeleton__line"
          :style="{ width }"
        />
      </div>

      <span class="base-skeleton__pill base-skeleton__pill--side" />
    </template>

    <template v-else>
      <div class="base-skeleton__stack base-skeleton__stack--text">
        <span
          v-for="(width, index) in resolvedLineWidths"
          :key="`text-line-${index}`"
          class="base-skeleton__line"
          :style="{ width }"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SkeletonVariant = 'card' | 'list-row' | 'text-block';

const props = withDefaults(
  defineProps<{
    animated?: boolean;
    lines?: number;
    showAvatar?: boolean;
    testId?: string;
    variant?: SkeletonVariant;
  }>(),
  {
    animated: true,
    lines: undefined,
    showAvatar: undefined,
    testId: 'base-skeleton',
    variant: 'card',
  },
);

const defaultLineCounts: Record<SkeletonVariant, number> = {
  card: 3,
  'list-row': 2,
  'text-block': 3,
};

const resolvedLineWidths = computed(() => {
  const count = props.lines ?? defaultLineCounts[props.variant];

  return Array.from({ length: count }, (_, index) => {
    const width = Math.max(40, 100 - index * 14);
    return `${width}%`;
  });
});

const showAvatar = computed(() => props.showAvatar ?? props.variant === 'list-row');
</script>

<style scoped lang="scss">
.base-skeleton {
  display: flex;
  gap: 0.875rem;
  border: 1px solid var(--expressa-border, #e0e0e0);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 245, 247, 0.96));
  padding: 1rem;
  color: transparent;
  overflow: hidden;

  &--animated .base-skeleton__line,
  &--animated .base-skeleton__pill,
  &--animated .base-skeleton__avatar,
  &--animated .base-skeleton__button {
    background-size: 200% 100%;
    animation: skeleton-wave 1.4s ease-in-out infinite;
  }

  &__line,
  &__pill,
  &__avatar,
  &__button {
    display: block;
    background:
      linear-gradient(
        90deg,
        rgba(245, 245, 247, 0.9) 25%,
        rgba(255, 255, 255, 0.96) 37%,
        rgba(245, 245, 247, 0.9) 63%
      );
    border-radius: 999px;
  }

  &__line {
    height: 0.875rem;
  }

  &__pill {
    width: 4.5rem;
    height: 1.5rem;
  }

  &__avatar {
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: 999px;
  }

  &__button {
    height: 2.5rem;
  }

  &__card-header,
  &__card-footer,
  &__row-content,
  &__stack {
    display: grid;
    gap: 0.625rem;
  }

  &__card-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  &__card-footer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 0.25rem;
  }

  &__stack {
    flex: 1 1 auto;
  }

  &__stack--text {
    width: 100%;
  }

  &__row-content {
    flex: 1 1 auto;
    align-content: center;
  }

  &__line--title {
    width: 45%;
    height: 1rem;
  }

  &__pill--side {
    align-self: center;
    width: 3.5rem;
    height: 1.25rem;
  }

  &--list-row {
    align-items: center;
  }
}

@keyframes skeleton-wave {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
