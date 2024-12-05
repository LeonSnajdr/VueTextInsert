export interface InsertItem {
    type: InsertType;
    text: string;
    value: string;
}

export interface InsertMenu {
    active: boolean;
    position: [number, number];
    addInsert: (item: InsertItem) => void;
    query: string;
}

export enum InsertType {
    Text = "Text",
    Insert = "Insert"
}
