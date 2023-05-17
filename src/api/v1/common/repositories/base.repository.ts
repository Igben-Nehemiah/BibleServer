import * as mongoose from "mongoose";
import { IBaseRepository } from "../interfaces";

class BaseRepository<T>
    implements IBaseRepository<T> {

    constructor(public readonly model: mongoose.Model<T & mongoose.Document>) {
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

    async getById(id: string | number): Promise<T> {
        const result = await this.model.findById(id).exec();
        var t = result?.toObject;
        throw new Error();
    }
};

export default BaseRepository;