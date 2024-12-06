<template>
    <VApp>
        <VMain>
            <VContainer>
                {{ renderArray }}
                <VField variant="outlined" class="pa-2 mb-2" active>
                    <VueTextInsertEditor v-model="renderArray" :editorOptions spellcheck="false"></VueTextInsertEditor>
                </VField>
                <VBtn @click="addItem()">Add item</VBtn>
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
    { type: InsertType.Text, value: "Ich finde" },
    { type: InsertType.Person, value: "Kittel" },
    { type: InsertType.Text, value: "sodert weniger als" },
    { type: InsertType.Person, value: "Roli", name: "Roli", age: 30, childern: [{ childName: "Leon" }] } as InsertItemPerson,
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

const addItem = () => {
    renderArray.value.push({
        type: InsertType.Person,
        value: "adedd",
    });
};
</script>
