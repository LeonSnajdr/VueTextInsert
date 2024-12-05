import type { App } from "vue";
import MountService from "./services/MountService";

export default {
    install: (app: App) => {
        MountService.setAppInstance(app);
    }
};

export { type InsertItem } from "@/contracts/Insert";
export { default as TextInsert } from "@/components/TextInsert.vue";
