import { HttpException } from "../../common/errors/custom-error";


class WrongCredentialsException extends HttpException {
    constructor() {
        super("Wrong credentials provided!", 401);
    }
};

export default WrongCredentialsException;