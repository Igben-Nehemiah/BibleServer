import { Result } from '@nehemy/result-monad';
import type BooksRepository from './repositories/books.repository';
import { BookResponse } from './dtos';
import { ExecutionResult, Source, graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { BookSchema } from './graphql/book.schema';

type GetBookWithGraphQlReturnType = ExecutionResult<
  ObjMap<unknown>,
  ObjMap<unknown>
>;

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

  async getBookWithGraphQl(
    query: string | Source,
    variables?: Maybe<{
      readonly [variable: string]: unknown;
    }>
  ) {
    try {
      const result = await graphql({
        schema: BookSchema,
        source: query,
        // rootValue: root,
        variableValues: variables,
      });

      return new Result<GetBookWithGraphQlReturnType>(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new Result<GetBookWithGraphQlReturnType>(err);
      }
      return new Result<GetBookWithGraphQlReturnType>(
        new Error('Unknown error occured while trying to query book')
      );
    }
  }
}

export default BooksService;
