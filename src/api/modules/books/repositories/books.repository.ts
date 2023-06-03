/* eslint-disable @typescript-eslint/no-explicit-any */

import BaseRepository from '../../../common/repositories/base.repository';
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
    chapterNumber: number = 1,
    verseNumber?: number
  ): Promise<string | string[]> {
    const book: Book = (await this.model.findOne({ name })) as Book;

    if (book == null) throw new Error(`${name} not found!`);

    const totalNumberOfChapters = book.chapters.length;

    if (chapterNumber - 1 < 0 || chapterNumber > totalNumberOfChapters)
      throw new Error('Invalid book chapter');

    const chapter = book.chapters[chapterNumber - 1];

    const numberOfChapterVerses = chapter[chapterNumber - 1].length;

    if (verseNumber === undefined) {
      return chapter;
    }

    if (verseNumber - 1 < 0 || verseNumber > numberOfChapterVerses)
      throw new Error('Invalid verse of chapter');

    return chapter[verseNumber - 1];
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
