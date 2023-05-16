import * as express from "express";
import ControllerBase from "./controllerBase";

class BooksController extends ControllerBase {
    /**
     * The constructor for a Book controller
     */
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