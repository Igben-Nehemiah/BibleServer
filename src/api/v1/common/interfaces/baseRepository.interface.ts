export interface IBaseRepository<T> {
    add: (item: T) => Promise<void>;
    remove: (item: T) => Promise<boolean>;
    getAll: () => Promise<T[]>;
    getById: (id: string | number) => Promise<T>;
}