import { Result } from '@nehemy/result-monad';
import type BooksRepository from './repositories/books.repository';
import { BookResponse } from './dtos';

class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getBook(
    name: string,
    chapterNumber: number,
    verseNumber?: number
  ): Promise<Result<BookResponse>> {
    try {
      const verses = await this.booksRepository.getBook(
        name,
        chapterNumber,
        verseNumber
      );
      return new Result(verses);
    } catch (e: unknown) {
      return new Result<BookResponse>(
        new Error((e as Error).message ?? 'Failed to get book')
      );
    }
  }
}

export default BooksService;
