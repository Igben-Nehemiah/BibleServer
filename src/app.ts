import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import IController from "./api/common/controller/controller.interface";
import { errorHandlerMiddleware } from "./api/middlewares";
import cookieParser from "cookie-parser";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: IController[], 
        port: number){
        this.app = express();
        this.port = port;

        this.connectToDatabase();
        this.initialiseMiddlewares();
        this.initialiseControllers(controllers);
        this.intialiseErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`);
        })
    }

    private initialiseMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initialiseControllers(controllers: IController[]){
        controllers.forEach(controller => {
            this.app.use("/", controller.router)
        });
    }

    private connectToDatabase() {
        const { MONGO_URI } = process.env;

        mongoose.connect(MONGO_URI || "")
            .then(re => console.log("Connected successfully!"))
            .catch(() => console.error("Failed to connect to db"));
    }

    private intialiseErrorHandling() {
        this.app.use(errorHandlerMiddleware);
    }
}

export default App;