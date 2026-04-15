/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;

  export default component;
}

declare module 'vuetify/styles';

interface TelegramWebApp {
  expand?: () => void;
  initData?: string;
  ready?: () => void;
}

interface TelegramRoot {
  WebApp?: TelegramWebApp;
}

interface Window {
  Telegram?: TelegramRoot;
}
