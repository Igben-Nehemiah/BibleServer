import { IEntity } from "../interfaces/entity.interface";

export interface IBaseRepository<T> {
    add: (item: T) => Promise<T>;
    remove: (item: T) => Promise<boolean>;
    getAll: () => Promise<T[]>;
    getById: (id: string | number) => Promise<T | null>;
    findByIdAndUpdate: (id: string | number, updatedModel: Partial<T>) => Promise<T | null>
};