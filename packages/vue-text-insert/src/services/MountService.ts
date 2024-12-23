import { h, render, type App, type Component } from "vue";
import { MountResult } from "@/types/InternalTypes";

class MountService {
    private appInstance?: App = undefined;

    public setAppInstance(appInstance: App) {
        if (this.appInstance) return;

        this.appInstance = appInstance;
    }

    public getAppInstance(): App {
        return this.appInstance!;
    }
    public mountComponent(component: Component, props: any, wrapperElement?: HTMLElement): MountResult {
        if (!this.appInstance) {
            throw "Could not mount component, since appInstance is not set. Ensure to use the plugin";
        }

        let vNode = h(component, props);

        vNode.appContext = this.appInstance._context;

        const element = wrapperElement ? wrapperElement : document.createElement("div");

        render(vNode, element);

        const unmount = () => {
            element.remove();
            render(null, element);
        };

        return {
            element: element,
            unmount: unmount,
        };
    }
}

export default new MountService();
