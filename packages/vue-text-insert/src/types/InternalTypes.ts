import { InsertOption } from "@/types/OptionTypes";

export interface InsertElement<T> {
    id: string;
    item: T;
    mountResult: MountResult;
}

export interface InsertMenu {
    insertType: string;
    mountResult: MountResult;
}

export interface InsertQueryResult {
    insertType: string;
    insertOption: InsertOption;
    query: string;
}

export interface MountResult {
    element: HTMLElement;
    unmount: () => void;
}
