import TextInsert from "@/components/TextInsert.vue";
import type { App } from "vue";

export default {
    install: (app: App) => {
        app.component("TextInsert", TextInsert);
    }
};

export { TextInsert };
