import { HttpException } from "../../../common/errors/custom-error";

export class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super('Authentication token missing', 401);
  };
};