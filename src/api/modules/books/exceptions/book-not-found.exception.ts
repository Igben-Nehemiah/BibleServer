import { HttpException } from '../../../common/errors/custom-error';

class BookNotFoundException extends HttpException {
  constructor(name: string) {
    super(`${name} not found in books`, 404);
  }
}

export default BookNotFoundException;
