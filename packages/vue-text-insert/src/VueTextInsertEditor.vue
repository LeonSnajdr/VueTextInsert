<template>
    <div ref="editor" @input="input" @keydown.enter.prevent @copy.prevent="copy" @paste.prevent="paste" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TextInsertEditorOptions } from "./VueTextInsertTypes";

const props = defineProps<{
    editorOptions: TextInsertEditorOptions;
}>();

const editor = ref<HTMLDivElement>();

const input = () => {
    throw "Not implemented!";
};

const copy = () => {
    throw "Not implemented!";
};

const paste = () => {
    throw "Not implemented!";
};
</script>

<style scoped>
#vueTextInsertEditor {
    width: 100%;
    outline: none;
}
</style>
