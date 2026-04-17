import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { backofficeAccessStore } from './stores/backoffice-access-store';
import { initializeTelegramWebApp } from './services/telegram-webapp';
import { vuetify } from './vuetify';
import './styles/main.scss';

initializeTelegramWebApp();
void backofficeAccessStore.initialize();

createApp(App).use(router).use(vuetify).mount('#app');
