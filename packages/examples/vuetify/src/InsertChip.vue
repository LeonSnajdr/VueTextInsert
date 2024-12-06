<template>
    <VChip class="mx-1" prependIcon="mdi-account" closable @click:close.prevent="props.remove()" size="small">
        {{ props.item.value }}
        <VMenu activator="parent">
            <VCard>
                <VCardText> Heyho </VCardText>
            </VCard>
        </VMenu>
    </VChip>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { InsertProps } from "vue-text-insert";
import { InsertItem } from "./Insert";

const props = defineProps<InsertProps<InsertItem>>();

onMounted(() => {});

onBeforeUnmount(() => {
    console.log("unmounted");
});
</script>
