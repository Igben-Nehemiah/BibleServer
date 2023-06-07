/* eslint-disable @typescript-eslint/no-unused-vars */

import type * as express from 'express';
import ControllerBase from '../../common/controller/base.controller';
import type BooksService from './books.service';
import BookNotFoundException from './exceptions/book-not-found.exception';
import { BadRequest, Ok } from '../../common/responses';
import { HttpException } from '../../common/errors/custom-error';

class BooksController extends ControllerBase {
  constructor(private readonly booksService: BooksService) {
    super();
    this.path = '/books';
    this.initiliseRoutes();
  }

  public initiliseRoutes() {
    this.router.get(this.path, this.getBook);
    this.router.post(`${this.path}/graphql`, this.getBookWithGraphQl);
  }

  private readonly getBook = async (
    request: express.Request,
    response: express.Response
  ) => {
    const {
      name,
      chapter,
      verse,
    }: { name?: string; chapter?: number; verse?: number } = request.query;

    if (name === undefined || name === '')
      throw new BadRequest('Book name cannot be empty');

    if (chapter === undefined) throw new BadRequest('Specify a chapter');

    const result = await this.booksService.getBook(name, chapter, verse);

    result.match(
      value => {
        response.send(new Ok(value));
      },
      err => {
        throw new HttpException(err.message, 401);
      }
    );

    return result.isSuccessful ? result : new BookNotFoundException(name);
  };

  private readonly getBookWithGraphQl = async (
    request: express.Request,
    response: express.Response
  ) => {
    const variables = request.body.variables;
    const query = request.body.query;

    const result = await this.booksService.getBookWithGraphQl(query, variables);

    result.match(
      value => {
        response.send(new Ok(value));
      },
      err => {
        throw new HttpException(err.message, 401);
      }
    );
  };
}

export default BooksController;
