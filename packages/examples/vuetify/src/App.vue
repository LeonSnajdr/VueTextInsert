<template>
    <VApp>
        <VMain>
            <VContainer>
                <VField variant="outlined" class="pa-2 mb-2" active>
                    <VueTextInsertEditor v-model="renderArray" :editorOptions></VueTextInsertEditor>
                </VField>
            </VContainer>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import { InsertItem, InsertItemPerson, InsertType } from "./Insert";
import { ref } from "vue";
import InsertChip from "./InsertChip.vue";
import InsertMenu from "./InsertMenu.vue";
import { VueTextInsertEditor, EditorOptions } from "vue-text-insert";

const renderArray = ref<InsertItem[]>([
    { type: InsertType.Text, value: "I think," },
    { type: InsertType.Person, value: "John Doe", age: 30 } as InsertItemPerson,
    { type: InsertType.Text, value: "should inform" },
    { type: InsertType.Person, value: "Jane Doe", age: 35 } as InsertItemPerson,
    { type: InsertType.Text, value: "about this topic.\nBest wishes" },
    { type: InsertType.Person, value: "Max Mustermann", age: 50 } as InsertItemPerson,
]);

const editorOptions: EditorOptions<InsertItem> = {
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
