import { HttpException } from "../../common/errors/custom-error";

class UserWithEmailAlreadyExistsException extends HttpException {
    constructor(email: string) {
        super(`${email} has already been used`, 400);
    }
};


export default UserWithEmailAlreadyExistsException;