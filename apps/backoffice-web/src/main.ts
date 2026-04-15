import { createApp } from 'vue';

import App from './App.vue';
import { router } from './app/router';
import { vuetify } from './app/plugins/vuetify';

const app = createApp(App);

app.use(router);
app.use(vuetify);

void router.isReady().then(() => {
  app.mount('#app');
});
