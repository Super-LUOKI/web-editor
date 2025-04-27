export type RequireField<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;