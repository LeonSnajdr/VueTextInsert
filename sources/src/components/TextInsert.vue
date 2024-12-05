<template>
    <div @input="input" @copy="copy" @pase="paste" @keydown.enter.prevent id="editor" ref="editor" contenteditable></div>
</template>

<script setup lang="ts">
import type { InsertItem } from "@/contracts/Insert";
import { onBeforeMount } from "vue";

const items = defineModel<InsertItem[]>({ required: true });

onBeforeMount(() => {
    console.log("mounted", items.value);
});

const input = () => {
    console.log("input");
};

const copy = () => {
    console.log("copy");
};

const paste = () => {
    console.log("paste");
};
</script>

<style>
#editor {
    width: 100%;
    outline: none;
}
</style>
