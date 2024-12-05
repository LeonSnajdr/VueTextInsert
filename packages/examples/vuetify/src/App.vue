<template>
    <VApp>
        <VMain>
            <VField variant="outlined" class="pa-2 ma-4">
                <VueTextInsertEditor></VueTextInsertEditor>
            </VField>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import { VueTextInsertEditor, TextInsertEditorOptions } from "vue-text-insert";

const editorOptions: TextInsertEditorOptions = {} as TextInsertEditorOptions;
</script>
