<template>
    <VApp>
        <VMain>
            <VField variant="outlined" style="padding: 5px" active>
                <VueTextInsertEditor v-model="renderArray" :editorOptions></VueTextInsertEditor>
            </VField>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import { InsertItem, InsertType } from "./Insert";
import { ref } from "vue";
import InsertChip from "./InsertChip.vue";
import InsertMenu from "./InsertMenu.vue";
import { VueTextInsertEditor, EditorOptions } from "vue-text-insert";

const renderArray = ref<InsertItem[]>([
    { type: InsertType.Text, value: "Ich finde" },
    { type: InsertType.Person, value: "Kittel" },
    { type: InsertType.Text, value: "sodert weniger als" },
    { type: InsertType.Person, value: "Roli" },
    { type: InsertType.Text, value: ". Das ist allerdings nicht schwer" },
]);

const editorOptions: EditorOptions<InsertItem, InsertType> = {
    textType: InsertType.Text,
    typeField: "type",
    valueField: "value",
    insertOptions: {
        [InsertType.Person]: {
            trigger: "@",
            insertComponent: InsertChip,
            menuComponent: InsertMenu,
        },
    },
};
</script>
