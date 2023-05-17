import * as express from "express";
import ControllerBase from "../../common/controller/base.controller";
import BooksService from "../services/books.service";

class BooksController extends ControllerBase {
    constructor(private readonly booksService: BooksService) {
        super();
        this.path = "/books";
        this.initiliseRoutes();
    }

    public initiliseRoutes() {
        this.router.get(this.path, this.getAllBooks.bind(this));
    }

    getAllBooks = async (request: express.Request, response: express.Response) => {
        const result = await this.booksService.getAllBooks();
        
        if (result.isSuccess){
            return response.send({"books": result.data});
        }

        response.send("");
    }
}

export default BooksController;