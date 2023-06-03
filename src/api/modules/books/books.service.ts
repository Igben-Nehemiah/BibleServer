import { Result } from '@nehemy/result-monad';
import { type Book } from './interfaces';
import type BooksRepository from './repositories/books.repository';

class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getBook(
    name: string,
    chapterNumber: number,
    verseNumber?: number
  ): Promise<Result<string | string[]>> {
    try {
      const verses = await this.booksRepository.getBook(
        name,
        chapterNumber,
        verseNumber
      );
      return new Result(verses);
    } catch (e: unknown) {
      return new Result<string | string[]>(
        new Error((e as Error).message ?? 'Failed to get book')
      );
    }
  }
}

export default BooksService;
