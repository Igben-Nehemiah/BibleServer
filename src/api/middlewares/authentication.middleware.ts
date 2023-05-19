import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { DataStoredInToken } from "../modules/authentication/interfaces";
import RequestWithUser from "../modules/authentication/interfaces/request-with-user.interface";
import userModel from "../modules/authentication/models/user.model";
import WrongAuthenticationTokenException from "../modules/authentication/exceptions/wrong-authentication-token.exception";

async function authenticationMiddleware(request: RequestWithUser, 
    response: Response, 
    next: NextFunction){
    const cookies = request.cookies;

    if (cookies && cookies.Authorization){
        const secret = process.env.JWT_SECRET!;

        try {
            const verificationResponse = 
                jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;

            const user = await userModel.findById(id);

            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            };
        } catch(e: unknown){
            next(new WrongAuthenticationTokenException());
        };
    } else {
        next(new WrongAuthenticationTokenException());
    };
};

export default authenticationMiddleware;