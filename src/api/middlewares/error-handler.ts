import { NextFunction, Request, Response } from "express";
import { HttpException } from "../common/errors/custom-error";
import { NotOk } from "../common/responses";

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) => {
        
    if (err instanceof HttpException) {
        res.status(err.statusCode).send(new NotOk(err.statusCode, err.message));
    }
    res.status(500)
        .send(new NotOk(500));
};

export default errorHandlerMiddleware;
