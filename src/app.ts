import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import IController from "./api/common/interfaces/controller.interface";
import { errorHandlerMiddleware } from "./api/v1/middlewares";

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
    }

    private initialiseControllers(controllers: IController[]){
        controllers.forEach(controller => {
            this.app.use("/", controller.router)
        });
    }

    private connectToDatabase() {
        const { MONGO_URI } = process.env;

        mongoose.connect(MONGO_URI || "");
    }

    private intialiseErrorHandling() {
        this.app.use(errorHandlerMiddleware);
    }
}

export default App;