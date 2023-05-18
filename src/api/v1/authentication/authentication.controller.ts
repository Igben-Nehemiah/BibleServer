import * as express from "express";
import IController from "../common/interfaces/controller.interface";

class AuthenticationController implements IController {
    public router = express.Router();
    public path = "/auth";

}