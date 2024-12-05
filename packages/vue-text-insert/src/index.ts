import { App } from "vue";
import VueTextInsert from "./components/VueTextInsert.vue";

export { VueTextInsert };

export default {
    install: (app: App) => {
        app.component("VueTextInsert", VueTextInsert);
    },
};
