<template>
    <VMenu v-model="open" :target="menu.value.position">
        <VSkeletonLoader v-if="loading" type="list-item-two-line" width="200"> </VSkeletonLoader>
        <VList v-else>
            <VListItem v-for="item in items" :key="item.id" @click="menu.value.addInsert({ value: item.text, age: 20, type: InsertType.Person, childern: [] })">
                {{ item.text }}
            </VListItem>
        </VList>
    </VMenu>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { MenuProps } from "vue-text-insert";
import { InsertItemPerson, InsertType } from "./Insert";

const props = defineProps<MenuProps<InsertItemPerson>>();

const open = ref(true);
const loading = ref(false);

const items = ref<{ id: string; text: string }[]>([]);

onMounted(() => {
    load();
});

onBeforeUnmount(() => {
    console.log("insert menu unmounted");
});

watch(open, () => {
    if (open.value === false) {
        props.menu.value.closeMenu();
    }
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
