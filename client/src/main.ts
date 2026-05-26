import { createApp } from "vue";
import { createPinia } from "pinia";

import { Toaster } from "vue-sonner";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/authStore";

import "./style.css";
import "vue-sonner/style.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();

if (authStore.token) {
  authStore.fetchCurrentUser();
}

app.component("Toaster", Toaster);

app.mount("#app");
