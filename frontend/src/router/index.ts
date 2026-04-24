import { createRouter, createWebHistory } from "vue-router";
import AccessDeniedView from "@/views/AccessDeniedView.vue";
import FeatureStubView from "@/views/FeatureStubView.vue";
import ForbiddenView from "@/views/ForbiddenView.vue";
import MenuCatalogView from "@/views/MenuCatalogView.vue";
import RootLayout from "@/views/RootLayout.vue";
import SettingsView from "@/views/SettingsView.vue";
import UsersView from "@/views/UsersView.vue";
import { ensureSession, useAuthSession } from "@/modules/auth/session-store";
import { SessionApiError } from "@/modules/auth/session-api";
import { resolveGuardDecision } from "@/router/guards";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/entry-denied",
      name: "entry-denied",
      component: AccessDeniedView,
      meta: { public: true },
    },
    {
      path: "/",
      component: RootLayout,
      children: [
        {
          path: "",
          name: "orders",
          component: FeatureStubView,
          props: {
            title: "Заказы",
            description:
              "Вход подтверждён. Операционная очередь заказов подключается отдельной задачей.",
          },
          meta: { capability: "orders" },
        },
        {
          path: "availability",
          name: "availability",
          component: FeatureStubView,
          props: {
            title: "Доступность",
            description:
              "Вход подтверждён. Управление доступностью меню подключается отдельной задачей.",
          },
          meta: { capability: "availability" },
        },
        {
          path: "menu",
          name: "menu",
          component: MenuCatalogView,
          meta: { capability: "menu" },
        },
        {
          path: "users",
          name: "users",
          component: UsersView,
          meta: { capability: "users" },
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsView,
          meta: { capability: "settings" },
        },
        {
          path: "forbidden",
          name: "forbidden",
          component: ForbiddenView,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.meta.public === true) {
    return true;
  }

  try {
    await ensureSession();
  } catch (error) {
    const reason =
      error instanceof SessionApiError
        ? error.code
        : (useAuthSession().state.errorCode ?? "unknown");
    return { name: "entry-denied", query: { reason } };
  }

  const decision = resolveGuardDecision(to, useAuthSession().state.actor);
  if (decision.kind === "allow") {
    return true;
  }

  return {
    name: decision.name,
    query: decision.name === "forbidden" ? { from: to.fullPath } : to.query,
  };
});
