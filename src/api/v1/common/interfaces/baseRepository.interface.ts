import { IEntity } from "./entity.interface";

export interface IBaseRepository<T> {
    add: (item: T) => Promise<T>;
    remove: (item: T) => Promise<boolean>;
    getAll: () => Promise<T[]>;
    getById: (id: string | number) => Promise<T | null>;
}