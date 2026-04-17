import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'expressa',
    themes: {
      expressa: {
        dark: false,
        colors: {
          background: '#f5f5f7',
          surface: '#ffffff',
          primary: '#1a1aff',
          secondary: '#4f566b',
          info: '#1a1aff',
          success: '#2e7d32',
          warning: '#e65100',
          error: '#d32f2f',
        },
      },
    },
  },
  defaults: {
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VBtn: {
      rounded: 'xl',
    },
  },
});
