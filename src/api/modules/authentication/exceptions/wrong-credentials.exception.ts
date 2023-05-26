import { HttpException } from "../../../common/errors/custom-error";

export class WrongCredentialsException extends HttpException {
    constructor() {
        super("Wrong credentials provided!", 401);
    }
};