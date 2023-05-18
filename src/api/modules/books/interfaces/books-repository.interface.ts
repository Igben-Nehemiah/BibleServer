import { Book } from "./book.interface";

export interface IBookRepository {
    getBookByName: (name: string) => Promise<Book>;
}