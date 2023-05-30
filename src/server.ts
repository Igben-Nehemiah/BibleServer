import { populateBooks } from '../populate';
import AuthenticationController from './api/modules/authentication/authentication.controller';
import AuthenticationService from './api/modules/authentication/authentication.service';
import UserModel from './api/modules/authentication/models/user.model';
import AuthenticationRepository from './api/modules/authentication/repositories/authentication.repository';
import BooksController from './api/modules/books/books.controller';
import BooksService from './api/modules/books/books.service';
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
const booksService = new BooksService(booksRepository);
const booksController = new BooksController(booksService);

const authRepository = new AuthenticationRepository(UserModel);
const authService = new AuthenticationService(authRepository);
const authController = new AuthenticationController(authService);

const app = new App([authController, booksController], port);

app.listen();
