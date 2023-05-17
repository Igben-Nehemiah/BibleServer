import BaseRepository from "../../common/repositories/base.repository";
import { IBook, IBookRepository as IBooksRepository } from "../interfaces";
import BookModel from "../models/book.model";

class BooksRepository 
    extends BaseRepository<IBook>
    implements IBooksRepository {
    
    constructor(model: typeof BookModel) {
        super(model)
    }

    async getBookByName(name: string): Promise<IBook>{
        const book = await this.model.findOne({name});
        
        if (!book) throw new Error(`${name} not found!`);

        return Promise.resolve(book as IBook);
    }
}

export default BooksRepository;