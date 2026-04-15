import { createRouter, createWebHistory } from 'vue-router';

import FoundationRuntimeView from '@/features/foundation-runtime/views/FoundationRuntimeView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'foundation-runtime',
      component: FoundationRuntimeView,
    },
  ],
});
