import * as express from "express";

export default interface IController {
    router: Router;
    path: string;
}