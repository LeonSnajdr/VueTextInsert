<template>
    <VChip class="mx-1" prependIcon="mdi-account" closable @click:close.prevent="props.destroy()" size="small">
        {{ item.value }} | {{ item.age }}
        <VMenu activator="parent">
            <VCard>
                <VCardText>
                    <p>Some more information</p>
                </VCardText>
            </VCard>
        </VMenu>
    </VChip>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { InsertProps } from "vue-text-insert";
import { InsertItemPerson } from "./Insert";

const props = defineProps<InsertProps<InsertItemPerson>>();

onMounted(() => {});

onBeforeUnmount(() => {
    console.log("unmounted");
});
</script>
