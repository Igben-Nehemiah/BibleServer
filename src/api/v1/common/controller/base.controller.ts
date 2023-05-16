import * as express from "express";

export default class ControllerBase {
    public path: string = "/";
    public router = express.Router();
}