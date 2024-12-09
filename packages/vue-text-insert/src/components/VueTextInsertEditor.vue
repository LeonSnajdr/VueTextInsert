<template>
    <div
        ref="editor"
        @input="input"
        @keydown="keydown"
        @copy.prevent="copy"
        @paste.prevent="paste"
        style="width: 100%; outline: none"
        contenteditable="plaintext-only"
    ></div>
</template>

<script setup lang="ts" generic="T, U extends string">
import { onBeforeUnmount, onMounted, ref, watch, render as vueRender, h } from "vue";
import { InsertProps } from "../types/PropTypes";
import { EditorOptions } from "../types/OptionTypes";
import { InsertElement } from "../types/InternalTypes";
import MountService from "../services/MountService";

const props = defineProps<{
    editorOptions: EditorOptions<T, U>;
}>();

const items = defineModel<T[]>({ required: true });

const editor = ref<HTMLDivElement>();

let internalItemsChange = false;
let insertElements: Record<string, InsertElement<T>> = {};

onMounted(() => {
    render();
});

onBeforeUnmount(() => {
    clear();
});

watch(
    items,
    () => {
        if (internalItemsChange) {
            internalItemsChange = false;
            return;
        }

        render();
    },
    { deep: true }
);

const keydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
    }
};

const input = () => {
    parseText();
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
            const itemValue = getItemValue(item);
            editor.value!.append(itemValue);
            return;
        }

        const insertElement = addInsertElement(item);
        editor.value!.append(insertElement.element);
    });
};

const addInsertElement = (item: T): InsertElement<T> => {
    const insertElementId = crypto.randomUUID();

    const wrapperElement = document.createElement("span");
    wrapperElement.contentEditable = "false";
    wrapperElement.setAttribute("insert-element-id", insertElementId);
    wrapperElement.setAttribute("insert-item-content", JSON.stringify(item));

    const insertOptions = props.editorOptions.insertOptions[getItemType(item)];

    if (!insertOptions) {
        throw `Failed to mount insert item ${JSON.stringify(item)}, because insertOptions are missing`;
    }

    const insertProps: InsertProps<T> = {
        item: item,
        destroy: () => {
            wrapperElement.remove();
            parseText();
        },
    };

    let vNode = h(insertOptions.insertComponent, insertProps);
    vNode.appContext = MountService.getAppInstance()._context;
    vueRender(vNode, wrapperElement);

    var insertElement: InsertElement<T> = {
        id: insertElementId,
        item: item,
        element: wrapperElement,
        unmount: () => {
            vueRender(null, wrapperElement);
            wrapperElement.remove();
        },
    };

    insertElements[insertElementId] = insertElement;

    editor.value!.append(wrapperElement);

    return insertElement;
};

const clear = () => {
    Object.keys(insertElements).forEach((x) => insertElements[x].unmount());

    insertElements = {};

    editor.value!.innerHTML = "";
};

const parseText = () => {
    const newInsertItems: T[] = [];
    const foundInsertElementIds: string[] = [];

    const addTextItem = (value: string) => {
        const item = {
            [props.editorOptions.typeField]: props.editorOptions.textType,
            [props.editorOptions.valueField]: value,
        } as T;

        newInsertItems.push(item);
    };

    const addInsertItem = (itemContent: string) => {
        const item: T = JSON.parse(itemContent);
        newInsertItems.push(item);
    };

    let currentText = "";

    editor.value!.childNodes.forEach((node) => {
        const element = node as HTMLElement;

        if (element.nodeType === Node.TEXT_NODE) {
            currentText += element.textContent;
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            if (currentText) {
                addTextItem(currentText);
                currentText = "";
            }

            const itemContent = element.getAttribute("insert-item-content");

            if (itemContent) {
                addInsertItem(itemContent);
                foundInsertElementIds.push(element.getAttribute("insert-element-id")!);
            }
        }
    });

    if (currentText) {
        addTextItem(currentText);
    }

    const deletedElementIds = Object.keys(insertElements).filter((x) => !foundInsertElementIds.includes(x));
    deletedElementIds.forEach((x) => {
        insertElements[x].unmount();
        delete insertElements[x];
    });

    internalItemsChange = true;
    items.value = newInsertItems;
};

const getItemType = (item: T): U => {
    return item[props.editorOptions.typeField] as U;
};

const getItemValue = (item: T): string => {
    return item[props.editorOptions.valueField] as string;
};
</script>
