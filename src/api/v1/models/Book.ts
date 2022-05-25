import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    abbrev: {
        type: String,
    },
    chapters: {
        type: [[String]],
    },
    name: String,
});

export default mongoose.model("Book", BookSchema);
