export interface Callback<T> {
    (error: Error | null | undefined, parameter: T | null | undefined): void;
}
export interface SuccessCallback<T> {
    (result?: T): void;
}
export interface ErrorCallback {
    (error?: Error | null | undefined): void;
}
