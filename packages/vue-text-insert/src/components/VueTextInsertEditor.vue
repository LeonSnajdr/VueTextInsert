<template>
    <div ref="editor" @input="input" @keydown.enter.prevent @copy.prevent="copy" @paste.prevent="paste" style="width: 100%; outline: none" contenteditable />
</template>

<script setup lang="ts" generic="T, U extends string">
import { onMounted, ref, watch } from "vue";
import { mount, MountResult } from "mount-vue-component";
import { v4 as uuid } from "uuid";
import { InsertProps } from "../types/PropTypes";
import { EditorOptions } from "../types/OptionTypes";
import { InsertElement } from "../types/InternalTypes";
import MountService from "../services/MountService";

const props = defineProps<{
    editorOptions: EditorOptions<T, U>;
}>();

const items = defineModel<T[]>({ required: true });

const editor = ref<HTMLDivElement>();

let insertElements: InsertElement<T>[] = [];

onMounted(() => {
    render();
});

watch(
    items,
    () => {
        render();
    },
    { deep: true }
);

const input = () => {
    throw "Not implemented!";
};

const copy = () => {
    throw "Not implemented!";
};

const paste = () => {
    throw "Not implemented!";
};

const render = (): void => {
    clear();

    items.value.forEach((item) => {
        const isConfiguredType = Object.keys(props.editorOptions.insertOptions).includes(getItemType(item));
        const isTextType = getItemType(item) === props.editorOptions.textType;

        if (!isTextType && !isConfiguredType) {
            console.error(`Trying to render unconfigured ItemType ${getItemType(item)}`);
            return;
        }

        if (isTextType) {
            editor.value!.append(getItemValue(item));
            return;
        }

        const insertElement = buildInsertElement(item);
        editor.value!.appendChild(insertElement.el);
    });
};

const buildInsertElement = (item: T): MountResult => {
    const insertElementId = uuid();

    const wrapperElement = document.createElement("span");
    wrapperElement.contentEditable = "false";
    wrapperElement.setAttribute("insertElementId", insertElementId);

    const insertProps: InsertProps<T> = {
        item: item,
        destroy: () => {
            const insertElement = insertElements.find((x) => x.id === insertElementId);
            insertElement!.destroy();
        },
    };

    const mountResult = mount(props.editorOptions.insertOptions[getItemType(item)]!.insertComponent, {
        props: insertProps,
        element: wrapperElement,
        app: MountService.getAppInstance(),
    });

    const insertElement: InsertElement<T> = {
        id: insertElementId,
        item: item,
        destroy: () => {
            wrapperElement.remove();
            mountResult.destroy();
        },
    };

    insertElements.push(insertElement);

    return mountResult;
};

const clear = () => {
    insertElements.forEach((insertElement) => {
        insertElement.destroy();
    });

    insertElements = [];

    editor.value!.innerHTML = "";
};

const getItemType = (item: T): U => {
    return item[props.editorOptions.typeField] as U;
};

const getItemValue = (item: T): string => {
    return item[props.editorOptions.valueField] as string;
};
</script>
