import Book from "../models/Book";
import { Request, Response } from "express";

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

    const books = await Book.find(queryObject);

    res.status(200).json({ books });
};

export default getAllBooks;
