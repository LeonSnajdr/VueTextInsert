import { Ref } from "vue";

export interface InsertProps<T> {
    item: T;
    destroy: () => void;
}

export interface MenuProps<T> {
    menu: Ref<MenuValues<T>>;
}

export interface MenuValues<T> {
    position: [number, number];
    query: string;
    addInsert: (item: T) => void;
    closeMenu: () => void;
}
