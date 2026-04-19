/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKOFFICE_API_BASE_URL?: string;
  readonly VITE_BACKOFFICE_TEST_TELEGRAM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TelegramWebApp {
  readonly initData?: string;
  ready?: () => void;
  expand?: () => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
