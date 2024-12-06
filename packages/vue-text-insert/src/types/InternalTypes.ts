export interface InsertElement<T> {
    id: string;
    item: T;
    unmount: () => void;
}
