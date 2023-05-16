import { IBook, IBookRepository } from "../interfaces";

class BookRepository implements IBookRepository {
    constructor() {
        
    }
    getAllBooks(): IBook[]{
        throw new Error();
    };

    getBookByName(name: string): IBook{
        throw new Error();
    }
}

export default BookRepository;