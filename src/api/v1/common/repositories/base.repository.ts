import * as mongoose from "mongoose";
import { IBaseRepository } from "../interfaces";

class BaseRepository<T>
    implements IBaseRepository<T> {

    constructor(public readonly model: mongoose.Model<T & mongoose.Document>) {
    } 
   
    async add(item: T): Promise<void> {
        const newItem = new this.model(item);
        await newItem.save();
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

    async getById(id: string | number): Promise<T> {
        const result = await this.model.findById(id);

        if(!result) throw new Error("Object not found!");

        return result as T;
    }
};

export default BaseRepository;