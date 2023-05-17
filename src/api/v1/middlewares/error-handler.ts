import { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../common/errors/custom-error";
import FailureResult from "../common/Results/failure.result";

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json(new FailureResult([err.message]));
    }
    return res
        .status(500)
        .json(new FailureResult(["Something went wrong, please try again"]));
};

export default errorHandlerMiddleware;
