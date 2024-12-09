export interface InsertElement<T> {
    id: string;
    item: T;
    element: HTMLElement;
    unmount: () => void;
}
