import mongoose from "mongoose";
import { IBook } from "../interfaces";

const bookSchema = new mongoose.Schema({
    abbrev: {
        type: String,
    },
    chapters: {
        type: [[String]],
    },
    name: String,
});

const BookModel = mongoose.model<IBook & mongoose.Document>("Book", bookSchema);

export default BookModel;