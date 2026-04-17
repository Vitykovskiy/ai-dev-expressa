import { createRouter, createWebHistory } from 'vue-router';
import PlaceholderPage from '../pages/PlaceholderPage.vue';
import { appEnvironment } from '../services/app-environment';
import { backofficeNavigation, defaultBackofficeRoute } from './backoffice-navigation';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: defaultBackofficeRoute.path,
    },
    ...backofficeNavigation.map((item) => ({
      path: item.path,
      name: item.tab,
      component: PlaceholderPage,
      props: {
        title: item.label,
        summary: item.summary,
        accent: item.accent,
      },
      meta: {
        title: item.label,
      },
    })),
    {
      path: '/:pathMatch(.*)*',
      redirect: defaultBackofficeRoute.path,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  if (typeof document === 'undefined') {
    return;
  }

  const title = typeof to.meta.title === 'string' ? to.meta.title : defaultBackofficeRoute.label;
  document.title = `${title} | ${appEnvironment.appTitle}`;
});
