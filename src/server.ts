import { Request, Response } from "express";
import express from "express";
import "express-async-errors";
import connectDB from "./config/database";
import { bookRouter } from "./api/v1/routes";
import { notFound, errorHandlerMiddleware } from "./api/v1/middlewares";
require("dotenv").config();

//Middlewares
const app = express();
app.use(express.json());

//Routes
app.use("/api/v1/kjv-bible", bookRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error();
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log("The application is listening on port 5000!");
        });
    } catch (err: unknown) {
        console.log(err);
    }
};

start();
