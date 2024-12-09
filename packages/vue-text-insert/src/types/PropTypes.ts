import { Ref } from "vue";

export interface InsertProps<T> {
    item: T;
    destroy: () => void;
}

export interface MenuProps<T> {
    active: boolean;
    position: [number, number];
    query: string;
    addInsert: (item: T) => void;
}
