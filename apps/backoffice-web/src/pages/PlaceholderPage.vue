<template>
  <v-row>
    <v-col cols="12">
      <v-card class="placeholder-page" rounded="xl">
        <div class="placeholder-page__rail" :style="{ background: accent }"></div>

        <div class="placeholder-page__content">
          <v-chip variant="tonal" color="primary" size="small">
            Следующий шаг
          </v-chip>

          <h3 class="placeholder-page__title">{{ title }}</h3>
          <p class="placeholder-page__summary">{{ summary }}</p>

          <div class="placeholder-page__grid">
            <section class="placeholder-page__panel">
              <p class="placeholder-page__panel-label">Что уже готово</p>
              <ul class="placeholder-page__list">
                <li>Маршрут зарегистрирован и доступен из root layout.</li>
                <li>Заглушка экрана стабильно собирается в составе `apps/backoffice-web`.</li>
                <li>Экран можно использовать как точку интеграции для следующих FE-задач.</li>
              </ul>
            </section>

            <section class="placeholder-page__panel">
              <p class="placeholder-page__panel-label">Что добавится дальше</p>
              <ul class="placeholder-page__list">
                <li>HTTP-bootstrap доступа и чтение серверного контекста.</li>
                <li>Хранилище `accessToken` и восстановление сессии.</li>
                <li>Ролевые guard-правила и экран отказа в доступе.</li>
              </ul>
            </section>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  summary: string;
  accent: string;
}>();
</script>

<style scoped lang="scss">
.placeholder-page {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);

  &__rail {
    height: 0.45rem;
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    margin: 1rem 0 0.75rem;
    color: var(--expressa-text);
    font-size: clamp(1.4rem, 1.6vw, 2rem);
    font-weight: 800;
    line-height: 1.1;
  }

  &__summary {
    margin: 0;
    max-width: 42rem;
    color: var(--expressa-secondary);
    font-size: 1rem;
    line-height: 1.7;
  }

  &__grid {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  &__panel {
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.72), rgba(255, 255, 255, 0.92));
  }

  &__panel-label {
    margin: 0 0 0.75rem;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__list {
    margin: 0;
    padding-left: 1.1rem;
    color: var(--expressa-text);
    line-height: 1.7;
  }
}

@media (min-width: 768px) {
  .placeholder-page {
    &__content {
      padding: 2rem;
    }

    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
