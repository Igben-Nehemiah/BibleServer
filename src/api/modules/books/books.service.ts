import Result from "../../common/responses/base.response";
import FailureResult from "../../common/responses/failure.response";
import Ok from "../../common/responses/ok.response";
import { Book } from "./interfaces";
import BooksRepository from "./repositories/books.repository";

class BooksService {
    constructor(private readonly booksRepository: BooksRepository) {
    }

    async getAllBooks(): Promise<Result<Book[]>> {
        try {
            const books = await this.booksRepository.getAll();
            return Promise.resolve(new Ok(books));
        }
        catch(e: unknown) {
            return Promise.resolve(new FailureResult("Failed to get books!"));
        }
    }

    async getBookByName(name: string): Promise<Result<Book>> {
        try {
            const book = await this.booksRepository.getBookByName(name);
            return new Ok(book);
        }catch(e: unknown){
            return new FailureResult("Failed to get book");
        }
    }
}

export default BooksService;