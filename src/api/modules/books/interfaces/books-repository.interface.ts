import { BookResponse } from '../dtos';

export interface IBookRepository {
  getBook: (name: string) => Promise<BookResponse>;
}
