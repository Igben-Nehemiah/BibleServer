import BooksController from "./api/modules/books/books.controller";
import BooksService from "./api/modules/books/books.service";
import BookModel from "./api/modules/books/models/book.model";
import BooksRepository from "./api/modules/books/repositories/books.repository";
import App from "./app";
import validateEnv from "./utils/validateEnv";


validateEnv();

// TODO: This should be done in a DI container or something
const booksRepository = new BooksRepository(BookModel);
const booksService = new BooksService(booksRepository);

const app = new App([
    new BooksController(booksService)
], 4000)

app.listen();
