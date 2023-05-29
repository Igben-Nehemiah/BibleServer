import { HttpException } from '../../../common/errors/custom-error'

export class UserWithEmailAlreadyExistsException extends HttpException {
  constructor (email: string) {
    super(`${email} has already been used`, 400)
  }
}
