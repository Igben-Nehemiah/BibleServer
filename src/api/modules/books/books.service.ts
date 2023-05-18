import Result from "../../common/Results/base.result";
import FailureResult from "../../common/Results/failure.result";
import SuccessResult from "../../common/Results/success.result";
import { IBook } from "./interfaces";
import BooksRepository from "./repositories/books.repository";

class BooksService {
    constructor(private readonly booksRepository: BooksRepository) {
    }

    async getAllBooks(): Promise<Result<IBook[]>> {
        try {
            const books = await this.booksRepository.getAll();
            return Promise.resolve(new SuccessResult(books));
        }
        catch(e: unknown) {
            return Promise.resolve(new FailureResult("Failed to get books!"));
        }
    }

    async getBookByName(name: string): Promise<Result<IBook>> {
        try {
            const book = await this.booksRepository.getBookByName(name);
            return new SuccessResult(book);
        }catch(e: unknown){
            return new FailureResult("Failed to get book");
        }
    }
}

export default BooksService;