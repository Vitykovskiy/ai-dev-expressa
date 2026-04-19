<template>
  <section class="forbidden-view">
    <div class="forbidden-view__content">
      <p class="forbidden-view__eyebrow">403</p>
      <h1 class="forbidden-view__title">Доступ к этой вкладке запрещён</h1>
      <p class="forbidden-view__text">
        Текущая роль не даёт права открыть этот раздел. Используйте вкладки, доступные
        после входа.
      </p>
    </div>
  </section>
</template>

<style scoped>
.forbidden-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 80px;
  background: #f5f5f7;
}

@media (min-width: 960px) {
  .forbidden-view {
    padding-bottom: 24px;
    background: #ffffff;
  }
}

.forbidden-view__content {
  max-width: 420px;
  text-align: center;
}

.forbidden-view__eyebrow {
  margin: 0 0 8px;
  color: #1a1aff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.forbidden-view__title {
  margin: 0 0 12px;
  color: #111111;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
}

.forbidden-view__text {
  margin: 0;
  color: #555555;
  font-size: 15px;
  line-height: 24px;
}
</style>
