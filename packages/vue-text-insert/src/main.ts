import { App } from "vue";
import MountService from "@/services/MountService";
import VueTextInsertEditor from "@/components/VueTextInsertEditor.vue";

export { VueTextInsertEditor };
export * from "@/types/OptionTypes";
export * from "@/types/PropTypes";

export default {
    install: (app: App) => {
        MountService.setAppInstance(app);
    },
};
