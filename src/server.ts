import AuthenticationController from './api/modules/authentication/authentication.controller';
import AuthenticationService from './api/modules/authentication/authentication.service';
import UserModel from './api/modules/authentication/models/user.model';
import AuthenticationRepository from './api/modules/authentication/repositories/authentication.repository';
import BooksController from './api/modules/books/books.controller';
import BooksService from './api/modules/books/books.service';
import { Book } from './api/modules/books/graphql/books.data';
import BookModel from './api/modules/books/models/book.model';
import BooksRepository from './api/modules/books/repositories/books.repository';
import App from './app';
import { connectToDatabase } from './utils/connect-db';
import validateEnv from './utils/validate-env';

validateEnv();
connectToDatabase();
// populateBooks();

const port = parseInt(`${process.env.PORT ?? 4000}`);

// TODO: This should be done in a DI container or something
const booksRepository = new BooksRepository(BookModel);

let books: Array<Book> = [];

async function populateBooksForGraphQl() {
  const result = await booksRepository.getAll();
  books = result.map(b => {
    return {
      type: 'Book',
      id: b.name,
      name: b.name,
      abbrev: b.abbrev,
      chapters: b.chapters,
    };
  });
}

populateBooksForGraphQl()
  .then(() => console.log('Populated books for graphql'))
  .catch(() => console.log('Populated books for graphql'));

function getBooksData(books: Array<Book>) {
  const booksData: { [name: string]: Book } = {};

  books.forEach(book => {
    booksData[book.name] = book;
  });

  return booksData;
}

const booksData = getBooksData(books);

export function getAllBooks() {
  return books;
}

export function getBookByName(bookName: string): Promise<Book | null> {
  return Promise.resolve(booksData[bookName]) ?? null;
}

export function getBookChapters(book: Book) {
  return book.chapters;
}

const booksService = new BooksService(booksRepository);
const booksController = new BooksController(booksService);

const authRepository = new AuthenticationRepository(UserModel);
const authService = new AuthenticationService(authRepository);
const authController = new AuthenticationController(authService);

const app = new App([authController, booksController], port);

app.listen();
