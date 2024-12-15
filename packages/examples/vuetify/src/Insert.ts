export interface InsertItem {
    type: InsertType;
    value: string;
}

export interface InsertItemText extends InsertItem {}

export interface InsertItemPerson extends InsertItem {
    age: number;
}

export enum InsertType {
    Text = "Text",
    Person = "Person",
}
