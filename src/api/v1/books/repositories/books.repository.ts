import BaseRepository from "../../common/repositories/base.repository";
import { IBook, IBookRepository as IBooksRepository } from "../interfaces";
import BookModel from "../models/book.model";

class BooksRepository 
    extends BaseRepository<IBook>
    implements IBooksRepository {
    
    constructor(model: typeof BookModel) {
        super(model)
    }

    getAllBooks(): IBook[]{
        throw new Error();
    };

    getBookByName(name: string): IBook{
        throw new Error();
    }
}

export default BooksRepository;