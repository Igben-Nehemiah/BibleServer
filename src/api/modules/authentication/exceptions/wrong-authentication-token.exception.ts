import { HttpException } from '../../../common/errors/custom-error'

export class WrongAuthenticationTokenException extends HttpException {
  constructor () {
    super('Wrong authentication token!', 401)
  };
};
