<template>
    <VMenu v-model="open" :target="menu.value.position">
        <VList>
            <VListItem v-for="item in filteredItems" :key="item.value" @click="menu.value.addInsert(item)">
                {{ item.value }}
            </VListItem>
        </VList>
    </VMenu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { MenuProps } from "vue-text-insert";
import { InsertItemPerson, InsertType } from "./Insert";

const props = defineProps<MenuProps<InsertItemPerson>>();

const open = ref(true);

const items = ref<InsertItemPerson[]>([
    { type: InsertType.Person, value: "John Doe", age: 30 },
    { type: InsertType.Person, value: "Jane Doe", age: 35 },
    { type: InsertType.Person, value: "Joe Shmoe", age: 20 },
    { type: InsertType.Person, value: "Joe Blow", age: 21 },
    { type: InsertType.Person, value: "Jon Smith", age: 18 },
    { type: InsertType.Person, value: "Max Mustermann", age: 50 },
]);

watch(open, () => {
    if (open.value === false) {
        props.menu.value.closeMenu();
    }
});

const filteredItems = computed(() => {
    if (props.menu.value.query === "") {
        return items.value;
    }

    console.log(props.menu.value.query);

    return items.value.filter((x) => {
        return x.value.toLowerCase().replace(/\s/g, "").includes(props.menu.value.query.toLowerCase().replace(/\s/g, ""));
    });
});
</script>
