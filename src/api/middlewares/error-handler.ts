import { NextFunction, Request, Response } from "express";
import { HttpException } from "../common/errors/custom-error";
import FailureResult from "../common/results/failure.result";

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) => {
        
    if (err instanceof HttpException) {
        res.status(err.statusCode).send(new FailureResult(err.message));
    }
    res.status(500)
        .send(new FailureResult("Something went wrong, please try again"));
};

export default errorHandlerMiddleware;
