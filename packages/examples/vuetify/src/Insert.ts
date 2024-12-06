export interface InsertItem {
    type: InsertType;
    value: string;
}

export interface InsertItemText extends InsertItem {}

export interface InsertItemPerson extends InsertItem {
    name: string;
    age: number;
    childern: InsertItemPersonChild[];
}

export interface InsertItemPersonChild {
    childName: string;
}

export interface InsertItemChild {}

export enum InsertType {
    Text = "Text",
    Person = "Person",
}
