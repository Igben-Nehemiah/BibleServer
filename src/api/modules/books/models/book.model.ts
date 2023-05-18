import mongoose from "mongoose";
import { Book } from "../interfaces";

const bookSchema = new mongoose.Schema({
    abbrev: {
        type: String,
    },
    chapters: {
        type: [[String]],
    },
    name: String,
});

const BookModel = mongoose.model<Book & mongoose.Document>("Book", bookSchema);

export default BookModel;