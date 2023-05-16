import * as express from "express";
import { IController } from "../interfaces";

export default class ControllerBase implements IContoller {
    public path: string = "/";
    public router = express.Router();
}