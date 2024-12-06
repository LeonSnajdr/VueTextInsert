export interface InsertItem {
    type: InsertType;
    value: string;
}

export enum InsertType {
    Text = "Text",
    Person = "Person",
}
