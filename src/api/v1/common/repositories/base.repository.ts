import * as mongoose from "mongoose";
import { IBaseRepository } from "../interfaces";

class BaseRepository<T> implements IBaseRepository<T> {

    constructor(public model: mongoose.Model<T>) {
    }

    add(item: T): Promise<void> {
        const newItem = new this.model(item);
        newItem.save();
        return Promise.resolve();
    }
    
    remove(item: T): Promise<boolean> {
        throw new Error();
    };

    getAll(): Promise<T[]> {
        throw new Error();
    }

    getById(id: string | number): Promise<T> {
        throw new Error();
    }
};

export default BaseRepository;