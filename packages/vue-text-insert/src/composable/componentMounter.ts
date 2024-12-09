import { Component, h, render } from "vue";
import { MountResult } from "../types/InternalTypes";
import MountService from "../services/MountService";

export function useComponentMounter(component: Component, props: any, wrapperElement?: HTMLElement): MountResult {
    let vNode = h(component, props);
    vNode.appContext = MountService.getAppInstance()._context;

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
