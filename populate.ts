import connectDB from "./src/config/database";
import Book from "./src/api/v1/models/Book";
require("dotenv").config();

const kjv = require("./en_kjv.json");

const start = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error();
        await connectDB(process.env.MONGO_URI);
        await Book.deleteMany();
        await Book.create(kjv);
        console.log("Success!!!");
        process.exit(0);
    } catch (error: unknown) {
        console.log(error);
        process.exit(1);
    }
};

start();
