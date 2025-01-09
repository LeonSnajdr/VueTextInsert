<template>
    <span ref="menu"></span>
    <div ref="editor" v-bind="$attrs" @input="input" @paste.prevent="paste" style="width: 100%; outline: none" contenteditable="plaintext-only"></div>
</template>

<script setup lang="ts" generic="T">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { InsertProps, MenuProps, MenuValues } from "@/types/PropTypes";
import { EditorOptions, InsertOption } from "@/types/OptionTypes";
import { InsertElement, InsertMenu, InsertQueryResult } from "@/types/InternalTypes";
import MountService from "@/services/MountService";

const props = defineProps<{
    editorOptions: EditorOptions<T>;
}>();

const items = defineModel<T[]>({ required: true });

const editor = ref<HTMLDivElement>();
const menu = ref<HTMLSpanElement>();
const menuValues = ref({} as MenuValues<T>);

let activeMenu: InsertMenu | undefined = undefined;
let internalItemsChange = false;
let insertElements: Record<string, InsertElement<T>> = {};

const INSERT_ELEMENT_ID = "insert-element-id";
const INSERT_ELEMENT_CONTENT = "insert-element-conent";

onMounted(() => {
    render();
});

onBeforeUnmount(() => {
    clearEditor();
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

const input = () => {
    detectMenu();
    handleInsertElements();
    parseEditorContentToItems();
};

const detectMenu = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        resetMenu();
        return;
    }

    const currentRange = selection.getRangeAt(0);
    const textBeforeCaret = getTextBeforeCaret(currentRange);
    const triggeredInsert = findTriggeredInsert(textBeforeCaret);

    if (!triggeredInsert) {
        resetMenu();
        return;
    }

    const { startOffset, endOffset } = getTriggerOffsets(currentRange, triggeredInsert);
    const menuPosition = getCaretScreenPosition(currentRange);

    menuValues.value = {
        query: triggeredInsert.query,
        position: menuPosition,
        addInsert: (item: T) => {
            insertItemAtTriggerPosition(item, currentRange, startOffset, endOffset);
        },
        closeMenu: resetMenu,
    };

    if (activeMenu?.insertType == triggeredInsert.insertType) return;

    resetMenu();
    mountMenuComponent(triggeredInsert);
};

const resetMenu = () => {
    if (!activeMenu) return;

    activeMenu.mountResult.unmount();
    activeMenu = undefined;
};

const findTriggeredInsert = (text: string): InsertQueryResult | undefined => {
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
        insertType: lastInsertType,
        insertOption: lastInsertOption,
        query: resultText,
    };
};

const getTextBeforeCaret = (range: Range): string => {
    const caretRange = range.cloneRange();
    caretRange.setStart(editor.value!, 0);

    return caretRange.toString();
};

const getTriggerOffsets = (range: Range, triggeredInsert: InsertQueryResult): { startOffset: number; endOffset: number } => {
    const endOffset = range.endOffset;
    const triggerLength = triggeredInsert.query.length + triggeredInsert.insertOption.trigger.length;
    const startOffset = endOffset - triggerLength;

    return { startOffset, endOffset };
};

const getCaretScreenPosition = (range: Range): [number, number] => {
    const tempSpan = document.createElement("span");
    tempSpan.appendChild(document.createTextNode("\u200b"));
    range.insertNode(tempSpan);
    const rect = tempSpan.getBoundingClientRect();
    tempSpan.remove();

    return [rect.left, rect.top];
};

const insertItemAtTriggerPosition = (item: T, range: Range, startOffset: number, endOffset: number) => {
    const newInsertElement = buildInsertElement(item);

    const replaceRange = document.createRange();
    replaceRange.setStart(range.startContainer, startOffset);
    replaceRange.setEnd(range.startContainer, endOffset);

    replaceRange.deleteContents();
    replaceRange.insertNode(newInsertElement.mountResult.element);

    // Move the caret to after the inserted element
    const selection = window.getSelection();
    if (selection) {
        const newRange = document.createRange();
        newRange.setStartAfter(newInsertElement.mountResult.element);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    resetMenu();
    parseEditorContentToItems();
};

const mountMenuComponent = (triggeredInsert: InsertQueryResult) => {
    const menuProps: MenuProps<T> = {
        menu: menuValues,
    };

    const menuMountResult = MountService.mountComponent(triggeredInsert.insertOption.menuComponent, menuProps);

    menu.value!.innerHTML = "";
    menu.value!.appendChild(menuMountResult.element);

    activeMenu = {
        insertType: triggeredInsert.insertType,
        mountResult: menuMountResult,
    };
};

const paste = (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData;

    if (!clipboardData) return;

    const text = clipboardData.getData("text/plain");

    const selection = window.getSelection();

    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    parseEditorContentToItems();
};

const render = (): void => {
    clearEditor();

    for (const item of items.value) {
        const isConfiguredType = Object.keys(props.editorOptions.insertOptions).includes(getItemType(item));
        const isTextType = getItemType(item) === props.editorOptions.textType;

        if (!isTextType && !isConfiguredType) {
            console.error(`Trying to render unconfigured ItemType ${getItemType(item)}`);
            continue;
        }

        if (isTextType) {
            const itemValue = getItemValue(item);
            editor.value!.append(itemValue);
            continue;
        }

        const insertElement = buildInsertElement(item);
        editor.value!.append(insertElement.mountResult.element);
    }
};

const buildInsertElement = (item: T): InsertElement<T> => {
    const insertElementId = crypto.randomUUID();

    const wrapperElement = document.createElement("span");
    wrapperElement.contentEditable = "false";
    wrapperElement.setAttribute(INSERT_ELEMENT_ID, insertElementId);
    wrapperElement.setAttribute(INSERT_ELEMENT_CONTENT, JSON.stringify(item));

    const insertOptions = props.editorOptions.insertOptions[getItemType(item)];

    if (!insertOptions) {
        throw `Failed to mount insert item ${JSON.stringify(item)}, because insertOptions are missing`;
    }

    const insertProps: InsertProps<T> = {
        item: item,
        destroy: () => {
            const range = document.createRange();
            range.setStartBefore(wrapperElement);
            range.collapse(true);

            const selection = window.getSelection()!;
            selection.removeAllRanges();
            selection.addRange(range);

            wrapperElement.remove();
            handleInsertElements();
            parseEditorContentToItems();
        },
    };

    const mountResult = MountService.mountComponent(insertOptions.insertComponent, insertProps, wrapperElement);

    let insertElement: InsertElement<T> = {
        id: insertElementId,
        item: item,
        mountResult: mountResult,
    };

    insertElements[insertElementId] = insertElement;

    return insertElement;
};

const clearEditor = () => {
    const insertElementIds = Object.keys(insertElements);
    for (const insertElementId of insertElementIds) {
        insertElements[insertElementId].mountResult.unmount();
        delete insertElements[insertElementId];
    }

    editor.value!.innerHTML = "";
};

// Re adds insert elements that got removed (for example by ctrl + z), also removes and destroys removed insert elemets
const handleInsertElements = () => {
    const foundInsertElementIds: string[] = [];

    const editorInsertElements = editor.value!.querySelectorAll(`[${INSERT_ELEMENT_ID}]`);
    for (const editorInsertElement of editorInsertElements) {
        const insertElementId = editorInsertElement.getAttribute(INSERT_ELEMENT_ID)!;

        foundInsertElementIds.push(insertElementId);

        if (insertElements[insertElementId]) continue;

        const itemContent = editorInsertElement.getAttribute(INSERT_ELEMENT_CONTENT)!;
        const item = JSON.parse(itemContent);

        const newInsertElement = buildInsertElement(item);

        foundInsertElementIds.push(newInsertElement.id);

        editorInsertElement.replaceWith(newInsertElement.mountResult.element);
    }

    const deletedInsertElementIds = Object.keys(insertElements).filter((x) => !foundInsertElementIds.includes(x));
    for (const deletedInsertElementId of deletedInsertElementIds) {
        insertElements[deletedInsertElementId].mountResult.unmount();
        delete insertElements[deletedInsertElementId];
    }
};

const parseEditorContentToItems = () => {
    const parsedItems: T[] = [];

    const addTextItem = (value: string) => {
        const item = {
            [props.editorOptions.typeField]: props.editorOptions.textType,
            [props.editorOptions.valueField]: value,
        } as T;

        parsedItems.push(item);
    };

    const addInsertItem = (itemContent: string) => {
        const item: T = JSON.parse(itemContent);
        parsedItems.push(item);
    };

    let currentText = "";

    for (const node of editor.value!.childNodes) {
        const element = node as HTMLElement;

        if (element.nodeType === Node.TEXT_NODE) {
            currentText += element.textContent;
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            if (currentText) {
                addTextItem(currentText);
                currentText = "";
            }

            const itemContent = element.getAttribute(INSERT_ELEMENT_CONTENT);
            if (itemContent) {
                addInsertItem(itemContent);
            }
        }
    }

    if (currentText) {
        addTextItem(currentText);
    }

    internalItemsChange = true;
    items.value = parsedItems;
};

const getItemType = (item: T): string => {
    return item[props.editorOptions.typeField] as string;
};

const getItemValue = (item: T): string => {
    return item[props.editorOptions.valueField] as string;
};
</script>
