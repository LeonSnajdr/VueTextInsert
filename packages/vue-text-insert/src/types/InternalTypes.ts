export interface InsertElement<T> {
    id: string;
    item: T;
    mountResult: MountResult;
}

export interface InsertMenu {
    activeType: string;
    mountResult: MountResult;
}

export interface MountResult {
    element: HTMLElement;
    unmount: () => void;
}
