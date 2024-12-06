export interface InsertElement<T> {
    id: string;
    item: T;
    destroy: () => void;
}
