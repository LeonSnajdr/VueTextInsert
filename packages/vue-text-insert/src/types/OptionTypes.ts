import { Component } from "vue";

export interface EditorOptions<T, U extends string> {
    textType: U;
    typeField: keyof T;
    valueField: keyof T;
    insertOptions: Partial<Record<U, InsertOption>>;
}

export interface InsertOption {
    trigger: string;
    insertComponent: Component;
    menuComponent: Component;
}
