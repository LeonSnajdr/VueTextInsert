import { Component } from "vue";

export interface EditorOptions<T> {
    textType: string;
    typeField: keyof T;
    valueField: keyof T;
    insertOptions: Record<string, InsertOption>;
}

export interface InsertOption {
    trigger: string;
    insertComponent: Component;
    menuComponent: Component;
}
