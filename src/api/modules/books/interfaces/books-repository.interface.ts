import { type Book } from './book.interface';

export interface IBookRepository {
  getBook: (name: string) => Promise<string | string[]>;
}
