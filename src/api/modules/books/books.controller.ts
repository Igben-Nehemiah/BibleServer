import * as express from "express";
import ControllerBase from "../../common/controller/base.controller";
import BooksService from "./books.service";
import throwIfNullOrUndefined from "../../common/guards/null-and-undefined.guard";
import BookNotFoundException from "./exceptions/book-not-found.exception";

class BooksController extends ControllerBase {
    constructor(private readonly booksService: BooksService) {
        super();
        this.path = "/books";
        this.initiliseRoutes();
    }

    public initiliseRoutes() {
        this.router.get(this.path, this.getAllBooks.bind(this));
    }

    private getAllBooks = async (request: express.Request, response: express.Response) => {
        const result = await this.booksService.getAllBooks();
        
        if (result.isSuccess){
            return response.send({"books": result.data});
        }
        response.send("");
    }

    private getBook = async (request: express.Request, response: express.Response) => {
        const { name } : { name?: string } = request.query;

        throwIfNullOrUndefined(name);

        const result = await this.booksService.getBookByName(name!);

        return result.isSuccess ? result : new BookNotFoundException(name!);
    }
}

export default BooksController;