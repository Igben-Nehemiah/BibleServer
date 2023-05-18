import BooksController from "./api/v1/books/books.controller";
import BooksService from "./api/v1/books/books.service";
import BookModel from "./api/v1/books/models/book.model";
import BooksRepository from "./api/v1/books/repositories/books.repository";
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
