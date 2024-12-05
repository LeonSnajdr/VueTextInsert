import { Component } from "vue";

export interface TextInsertEditorOptions {
    textType: string;
    typeField: string;
    valueField: string;
    insertOptions: Record<string, InsertOption>;
}

export interface InsertOption {
    trigger: string;
    insertComponent: Component;
    menuComponent: Component;
}
