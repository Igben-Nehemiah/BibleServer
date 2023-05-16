import { IBook } from "./book.interface";

export interface IBookRepository {
    getAllBooks: () => IBook[];
    getBookByName: (name: string) => IBook;
}