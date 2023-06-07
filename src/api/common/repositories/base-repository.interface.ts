export interface IBaseRepository<T> {
  add: (item: T) => Promise<T>;
  remove: (item: T) => Promise<boolean>;
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  findByIdAndUpdate: (
    id: string,
    updatedModel: Partial<T>
  ) => Promise<T | null>;
}
