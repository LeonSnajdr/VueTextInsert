<template>
    <span ref="menu"></span>
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

<script setup lang="ts" generic="T">
import { onBeforeUnmount, onMounted, ref, toRef, toRefs, watch } from "vue";
import { InsertProps, MenuProps, MenuValues } from "../types/PropTypes";
import { EditorOptions, InsertOption } from "../types/OptionTypes";
import { InsertElement, InsertMenu, MountResult } from "../types/InternalTypes";
import { useComponentMounter } from "../composable/componentMounter";
import { useSelection } from "../composable/selection";

const props = defineProps<{
    editorOptions: EditorOptions<T>;
}>();

const items = defineModel<T[]>({ required: true });

const menu = ref<HTMLSpanElement>();
const menuValues = ref({} as MenuValues<T>);

const editor = ref<HTMLDivElement>();

let activeMenu: { insertType: string; mountResult: MountResult };
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
    detectMenu();
    parseText();
};

const detectMenu = () => {
    const range = window.getSelection()!.getRangeAt(0);

    const insertOffsetEnd = range.endOffset;
    const textBeforeCaret = range.startContainer.textContent ?? "";

    const triggeredInsert = findTriggeredInsert(textBeforeCaret);

    if (!triggeredInsert) {
        if (!menuValues.value) return;
        menuValues.value.active = false;
        return;
    }

    const insertOffsetStart = insertOffsetEnd - (triggeredInsert.query.length + triggeredInsert.insertOption.trigger.length);

    const span = document.createElement("span");
    span.appendChild(document.createTextNode("\u200b"));
    range.insertNode(span);
    const rect = span.getBoundingClientRect();
    span.remove();

    const positon: [number, number] = [rect.left, rect.top];

    menuValues.value = {
        active: true,
        query: triggeredInsert.query,
        position: positon,
        addInsert: (item: T) => {
            const newInsertElement = buildInsertElement(item);

            const replaceRange = document.createRange();
            replaceRange.setStart(range.startContainer, insertOffsetStart);
            replaceRange.setEnd(range.startContainer, insertOffsetEnd);

            replaceRange.deleteContents();
            replaceRange.insertNode(newInsertElement.mountResult.element);

            // Move the cursor to the end of the inserted node
            const selection = window.getSelection();
            replaceRange.setStartAfter(newInsertElement.mountResult.element);
            replaceRange.setEndAfter(newInsertElement.mountResult.element);
            selection!.removeAllRanges();
            selection!.addRange(replaceRange);

            menuValues.value.active = false;
            parseText();
        },
    };

    if (activeMenu?.insertType == triggeredInsert.type) return;

    activeMenu?.mountResult.unmount();

    const menuProps: MenuProps<T> = {
        menu: menuValues,
    };

    const menuMountResult = useComponentMounter(triggeredInsert.insertOption.menuComponent, menuProps);

    menu.value!.innerHTML = "";
    menu.value!.appendChild(menuMountResult.element);

    activeMenu = {
        insertType: triggeredInsert.type,
        mountResult: menuMountResult,
    };
};

const findTriggeredInsert = (text: string): { type: string; insertOption: InsertOption; query: string } | undefined => {
    let lastTriggerIndex = -1;

    let lastInsertType: string = "";
    let lastInsertOption: InsertOption = {} as InsertOption;

    for (const [insertType, insertOption] of Object.entries(props.editorOptions.insertOptions)) {
        let triggerIndex = text.lastIndexOf(insertOption.trigger);

        if (triggerIndex > lastTriggerIndex) {
            lastTriggerIndex = triggerIndex;
            lastInsertType = insertType;
            lastInsertOption = insertOption;
        }
    }

    if (lastTriggerIndex === -1) return undefined;

    const resultText = text.slice(lastTriggerIndex + lastInsertOption.trigger.length);
    const hasWhitespace = /\s{2,}/.test(resultText);

    if (hasWhitespace) return undefined;

    return {
        type: lastInsertType,
        insertOption: lastInsertOption,
        query: resultText,
    };
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

        const insertElement = buildInsertElement(item);
        editor.value!.append(insertElement.mountResult.element);
    });
};

const buildInsertElement = (item: T): InsertElement<T> => {
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

    const mountResult = useComponentMounter(insertOptions.insertComponent, insertProps, wrapperElement);

    var insertElement: InsertElement<T> = {
        id: insertElementId,
        item: item,
        mountResult: mountResult,
    };

    insertElements[insertElementId] = insertElement;

    return insertElement;
};

const clear = () => {
    Object.keys(insertElements).forEach((x) => insertElements[x].mountResult.unmount());

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
        insertElements[x].mountResult.unmount();
        delete insertElements[x];
    });

    internalItemsChange = true;
    items.value = newInsertItems;
};

const getItemType = (item: T): string => {
    return item[props.editorOptions.typeField] as string;
};

const getItemValue = (item: T): string => {
    return item[props.editorOptions.valueField] as string;
};
</script>
