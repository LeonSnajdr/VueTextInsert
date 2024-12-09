<template>
    <v-menu v-model="menAc" :target="menu.value.position">
        <v-skeleton-loader v-if="loading" type="list-item-two-line" width="200"> </v-skeleton-loader>

        <v-list v-else>
            <v-list-item v-for="item in items" :key="item.id">
                {{ item.text }}
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, Ref, ref, watch } from "vue";
import { MenuProps } from "vue-text-insert";
import { InsertItemPerson } from "./Insert";

const menAc = ref(true);

const props = defineProps<{
    menu: Ref<MenuProps<InsertItemPerson>>;
}>();

const loading = ref(false);

const items = ref<{ id: string; text: string }[]>([]);

onBeforeMount(() => {
    load();
});

onBeforeUnmount(() => {
    console.log("insert menu unmounted");
});

watch(
    () => props.menu.value.query,
    () => {
        load();
    }
);

const load = async () => {
    loading.value = true;
    const allItems = [
        { id: "leonId", text: "Leon" },
        { id: "kittelId", text: "Kittel" },
        { id: "roliId", text: "Roli" },
        { id: "schweimiId", text: "Schweimi" },
        { id: "roemerId", text: "Römer" },
    ];

    items.value = allItems.filter((x) =>
        x.text
            .toLowerCase()
            .replace(/\s/g, "")
            .includes(props.menu.value.query ? props.menu.value.query.toLowerCase().replace(/\s/g, "") : "")
    );

    loading.value = false;
};
</script>
