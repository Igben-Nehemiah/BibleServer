import * as express from "express";
import ControllerBase from "../../common/controller/base.controller";

class BooksController extends ControllerBase {
    constructor() {
        super();
        this.path = "/books";
        this.initiliseRoutes();
    }

    public initiliseRoutes() {
        this.router.get(this.path, this.getAllBooks.bind(this));
    }

    getAllBooks = (request: express.Request, response: express.Response) => {
        response.send("books");
    }
}

export default BooksController;