import { HttpException } from "../../../common/errors/custom-error";

class WrongAuthenticationTokenException extends HttpException {
    constructor() {
        super("Wrong authentication token!", 401);
    }
};

export default WrongAuthenticationTokenException;