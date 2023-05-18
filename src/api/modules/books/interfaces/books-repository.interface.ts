import { IBook } from "./book.interface";

export interface IBookRepository {
    getBookByName: (name: string) => Promise<IBook>;
}