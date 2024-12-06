<template>
    <VChip class="mx-1" prependIcon="mdi-account" closable @click:close.prevent="props.remove()" size="small">
        {{ item.name }} | {{ item.age }}
        <VMenu activator="parent">
            <VCard>
                <VCardText>
                    <h3>Children:</h3>
                    <p v-for="child in item.childern">- {{ child.childName }}</p>
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
