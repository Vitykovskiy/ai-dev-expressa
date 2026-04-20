import { createApp } from "vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import App from "@/App.vue";
import { router } from "@/router";
import "./styles.css";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "expressa",
    themes: {
      expressa: {
        dark: false,
        colors: {
          background: "#F5F5F7",
          surface: "#FFFFFF",
          primary: "#1A1AFF",
          secondary: "#F5F5F7",
          "secondary-text": "#555555",
          error: "#D32F2F",
          success: "#2E7D32",
          warning: "#E65100",
          "accent-light": "#E8E8FF",
          "error-light": "#FFEBEE",
          "success-light": "#E8F5E9",
          "warning-light": "#FFF3E0",
          border: "#E0E0E0",
        },
      },
    },
  },
});

createApp(App).use(vuetify).use(router).mount("#app");
