import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    abbrev: {
        type: String,
    },
    chapters: {
        type: [[String]],
    },
    name: String,
});

const BookModel = mongoose.model("Book", bookSchema);
