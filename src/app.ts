import * as express from "express";
import * as bodyParser from "body-parser";
import { IController } from "./interfaces";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: IController[], 
        port: number){
        this.app = express();
        this.port = port;

        this.initiliseMiddlewares();
        this.initialiseControllers(controllers);
    }

    private initialiseMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initialiseControllers(controllers){
        controllers.forEach(controller => {
            this.app.use("/", controller.router)
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`);
        })
    }
}

export default App;