import { type Result } from '@nehemy/result-monad';
import { type Book } from './interfaces';
import type BooksRepository from './repositories/books.repository';
import { Ok } from '../../common/responses';

class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getAllBooks(): Promise<Result<Book[]>> {
    try {
      const books = await this.booksRepository.getAll();
      return await Promise.resolve(new Ok(books));
    } catch (e: unknown) {
      return await Promise.resolve(new FailureResult('Failed to get books!'));
    }
  }

  async getBookByName(name: string): Promise<Result<Book>> {
    try {
      const book = await this.booksRepository.getBookByName(name);
      return new Ok(book);
    } catch (e: unknown) {
      return new FailureResult('Failed to get book');
    }
  }
}

export default BooksService;
