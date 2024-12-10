export interface InsertElement<T> {
    id: string;
    item: T;
    mountResult: MountResult;
}

export interface InsertMenu<T> {
    activeType: string;
    mountResult: MountResult;
    active: boolean;
    position: [number, number];
    query: string;
    addInsert: (item: T) => void;
}

export interface MountResult {
    element: HTMLElement;
    unmount: () => void;
}
