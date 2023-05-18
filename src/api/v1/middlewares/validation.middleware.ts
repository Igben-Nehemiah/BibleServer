import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import * as express from "express";
import { HttpException } from "../common/errors/custom-error";


function validationMiddleware(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      validate(plainToInstance(type, req.body), { skipMissingProperties })
        .then((errors: ValidationError[]) => {
          if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
            next(new HttpException(message, 400));
          } else {
            next();
          }
        });
    };
  }
   
  export default validationMiddleware;