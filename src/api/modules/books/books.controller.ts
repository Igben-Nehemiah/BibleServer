/* eslint-disable @typescript-eslint/no-unused-vars */

import type * as express from 'express';
import ControllerBase from '../../common/controller/base.controller';
import type BooksService from './books.service';
import BookNotFoundException from './exceptions/book-not-found.exception';

class BooksController extends ControllerBase {
  constructor(private readonly booksService: BooksService) {
    super();
    this.path = '/books';
    this.initiliseRoutes();
  }

  public initiliseRoutes() {
    this.router.get(
      this.path,
      this.getAllBooks.bind(this) as express.RequestHandler
    );
  }

  private readonly getAllBooks = async (
    _request: express.Request,
    response: express.Response
  ) => {
    const result = await this.booksService.getAllBooks();

    if (result.isSuccessful) {
      return response.send({ books: result.value });
    }
    response.send('');
  };

  private readonly getBook = async (
    request: express.Request,
    _response: express.Response
  ) => {
    const { name }: { name?: string } = request.query;

    if (name === undefined || name === '')
      throw new Error('Book name cannot be empty');

    const result = await this.booksService.getBookByName(name);

    return result.isSuccessful ? result : new BookNotFoundException(name);
  };
}

export default BooksController;
