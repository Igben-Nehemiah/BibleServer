import { Router } from "express";
import getAllBooks from "../controllers/books";

const bookRouter = Router();

bookRouter.route("/").get(getAllBooks);

export default bookRouter;
