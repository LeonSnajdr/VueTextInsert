<template>
    <div ref="vueTextInsertEditor" id="vueTextInsertEditor" @input="input" @keydown.enter.prevent @copy.prevent="copy" @paste.prevent="paste" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const editor = ref<HTMLDivElement>();

const input = () => {
    throw new Error("Not implemented!");
};

const copy = () => {
    throw new Error("Not implemented!");
};

const paste = () => {
    throw new Error("Not implemented!");
};
</script>

<style scoped>
#vueTextInsertEditor {
    width: 100%;
    outline: none;
}
</style>
