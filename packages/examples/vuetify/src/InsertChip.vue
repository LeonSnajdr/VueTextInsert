<template>
    <v-chip class="mx-1" prependIcon="mdi-account" closable @click:close.prevent="props.destroy()" size="small">
        {{ props.item.value }}
        <v-menu activator="parent">
            <v-card>
                <v-card-text> Heyho </v-card-text>
            </v-card>
        </v-menu>
    </v-chip>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { InsertProps } from "vue-text-insert";
import { InsertItem } from "./Insert";

const props = defineProps<InsertProps<InsertItem>>();

onMounted(() => {
    console.log(props);
});

onBeforeUnmount(() => {
    console.log("unmounted");
});
</script>
