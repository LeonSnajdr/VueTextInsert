import { App } from "vue";
import MountService from "./MountService";

export * as VueTextInsertEditor from "./VueTextInsertEditor.vue";
export * from "./VueTextInsertTypes";

export default {
    install: (app: App) => {
        MountService.setAppInstance(app);
    },
};
