import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'expressaFoundation',
    themes: {
      expressaFoundation: {
        dark: false,
        colors: {
          background: '#f5efe8',
          surface: '#fffaf4',
          primary: '#7b3f1d',
          secondary: '#bf7b45',
          success: '#2f6f4f',
          error: '#8a3123',
        },
      },
    },
  },
});
