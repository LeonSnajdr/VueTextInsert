import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import vueTextInsert from "vue-text-insert";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.css";

const app = createApp(App);
const vuetify = createVuetify();

app.use(vuetify);
app.use(vueTextInsert);

app.mount("#app");
