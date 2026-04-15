<template>
  <v-app class="app-shell">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-shell {
  background:
    radial-gradient(circle at top, rgba(214, 115, 59, 0.16), transparent 38%),
    linear-gradient(180deg, #f5efe8 0%, #efe2d3 100%);
  min-height: 100vh;
}
</style>
