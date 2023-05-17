import { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../common/errors/custom-error";

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res
        .status(500)
        .json({ msg: "Something went wrong, please try again" });
};

export default errorHandlerMiddleware;
