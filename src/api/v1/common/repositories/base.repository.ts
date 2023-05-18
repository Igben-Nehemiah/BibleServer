import * as mongoose from "mongoose";
import { IBaseRepository } from "../interfaces";

class BaseRepository<T>
    implements IBaseRepository<T> {

    constructor(public readonly model: mongoose.Model<T & mongoose.Document>) {
    } 
   
    async add(item: T): Promise<T> {
        const newItem = new this.model(item);
        return (await newItem.save()) as T;
    }
    
    // Rework later!!!
    async remove(item: T): Promise<boolean> {
        return await this.model.remove(item).exec();
    };

    async getAll(): Promise<T[]> {
        const result = await this.model.find()
            .lean();

        return result as T[];
    }

    async getById(id: string | number): Promise<T | null> {
        const result = await this.model.findById(id);
        return result as T;
    }
};

export default BaseRepository;