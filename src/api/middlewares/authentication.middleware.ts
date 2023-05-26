import { NextFunction, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { DataStoredInToken, RequestWithUser, User } from "../modules/authentication/interfaces";
import userModel from "../modules/authentication/models/user.model";
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from "../modules/authentication/exceptions";

export function authenticationMiddleware(omitSecondFactor = false): any {
    return async (request: RequestWithUser, response: Response, next: NextFunction) => {
      const cookies = request.cookies;
      if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET || "";
        try {
          const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
          const { _id: id, isSecondFactorAuthenticated } = verificationResponse;
          const user = await userModel.findById(id);
          if (user) {
            if (!omitSecondFactor && user.isTwoFactorAuthenticationEnabled && !isSecondFactorAuthenticated) {
              next(new WrongAuthenticationTokenException());
            } else {
              request.user = user;
              next();
            }
          } else {
            next(new WrongAuthenticationTokenException());
          }
        } catch (error) {
          next(new WrongAuthenticationTokenException());
        }
      } else {
        next(new AuthenticationTokenMissingException());
      }
    };
  }