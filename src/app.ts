import express from "express";
import * as bodyParser from "body-parser";
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

        this.initialiseMiddlewares();
        this.initialiseControllers(controllers);
        this.intialiseErrorHandling();
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`);
        });
    };

    private initialiseMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    };

    private initialiseControllers(controllers: IController[]){
        controllers.forEach(controller => {
            this.app.use("/", controller.router)
        });
    };

    private intialiseErrorHandling() {
        this.app.use(errorHandlerMiddleware);
    };
}

export default App;