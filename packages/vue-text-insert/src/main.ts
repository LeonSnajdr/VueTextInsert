import { App } from "vue";
import VueTextInsert from "./components/VueTextInsert.vue";
import MountService from "./services/MountService";

export { VueTextInsert };

export default {
    install: (app: App) => {
        MountService.setAppInstance(app);
    },
};
