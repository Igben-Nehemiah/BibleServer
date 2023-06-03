/* eslint-disable @typescript-eslint/no-explicit-any */

import BaseRepository from '../../../common/repositories/base.repository';
import { BookResponse } from '../dtos';
import {
  type Book,
  type IBookRepository as IBooksRepository,
} from '../interfaces';
import BookModel from '../models/book.model';

class BooksRepository extends BaseRepository<Book> implements IBooksRepository {
  constructor(model: typeof BookModel) {
    super(model);
  }

  async getBook(
    name: string,
    chapterNumber = 1,
    verseNumber?: number
  ): Promise<BookResponse> {
    const queryObject: {
      name?: {
        $regex: any;
        $options: string;
      };
    } = {};

    queryObject.name = { $regex: name, $options: 'i' };

    const book: Book = (await this.model.findOne(queryObject)) as Book;

    if (book == null) throw new Error(`${name} not found!`);

    const totalNumberOfChapters = book.chapters.length;

    if (chapterNumber - 1 < 0 || chapterNumber > totalNumberOfChapters)
      throw new Error('Invalid book chapter');

    const chapter = book.chapters[chapterNumber - 1];

    const totalNumberOfVerses = chapter[chapterNumber - 1].length;

    if (verseNumber === undefined) {
      return {
        abbreviation: book.abbrev,
        chapter: chapterNumber,
        totalNumberOfVerses: totalNumberOfVerses,
        book: book.name,
        verse: 'all',
        data: chapter,
        totalNumberOfChapters,
      };
    }

    if (verseNumber - 1 < 0 || verseNumber > totalNumberOfVerses)
      throw new Error('Invalid verse of chapter');

    return {
      abbreviation: book.abbrev,
      chapter: chapterNumber,
      book: book.name,
      verse: verseNumber,
      data: chapter[verseNumber - 1],
      totalNumberOfVerses,
      totalNumberOfChapters,
    };
  }

  // async getAllBooks(
  //   name?: string,
  //   chapter: string = '1',
  //   verse: string = '1'
  // ): Promise<Book[]> {
  //   const queryObject: {
  //     name?: {
  //       $regex: any;
  //       $options: string;
  //     };
  //   } = {};

  //   if (name !== undefined) {
  //     queryObject.name = { $regex: name, $options: 'i' };
  //   }

  //   const pipeline = [
  //     // Match the book by name
  //     {
  //       $match: { name: name },
  //     },
  //     //Add a field with the total number of chapters
  //     {
  //       $addFields: {
  //         totalChapters: { $size: '$chapters' },
  //       },
  //     },
  //     //Filter the chapters based on the provided chapter number
  //     {
  //       $project: {
  //         name: 1,
  //         totalChapters: 1,
  //         selectedChapter: {
  //           $arrayElemAt: [
  //             '$chapters',
  //             { $subtract: [parseInt(chapter, 10) - 1, 1] },
  //           ],
  //         },
  //       },
  //     },
  //     //Unwind the selected chapter array
  //     { $unwind: '$selectedChapter' },
  //     // Add a field with the total number of verses in the selected chapter
  //     {
  //       $addFields: {
  //         totalVerses: { $size: '$selectedChapter' },
  //       },
  //     },
  //     // Filter the verses based on the provided verse number
  //     {
  //       $project: {
  //         name: 1,
  //         totalChapters: 1,
  //         totalVerses: 1,
  //         selectedVerse: {
  //           $arrayElemAt: [
  //             '$selectedChapter',
  //             { $subtract: [parseInt(verse, 10) - 1, 1] },
  //           ],
  //         },
  //       },
  //     },
  //   ];

  //   // const something = await BookModel.aggregate(pipeline);

  //   const books = await this.model.find(queryObject);
  //   return books as Book[];
  // }
}

export default BooksRepository;
