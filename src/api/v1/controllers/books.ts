import { Request, Response } from "express";
import BookModel from "../books/models/book.model";

const getAllBooks = async (req: Request, res: Response) => {
    const { name } = req.query;

    const queryObject: {
        name?: {
            $regex: any;
            $options: string;
        };
    } = {};

    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    const books = await BookModel.find(queryObject);

    res.status(200).json({ books });
};

export default getAllBooks;
