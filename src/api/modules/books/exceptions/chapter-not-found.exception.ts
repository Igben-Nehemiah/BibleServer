import { HttpException } from '../../../common/errors/custom-error';

class ChapterNotFoundException extends HttpException {
  constructor(bookName: string, chapter: number) {
    super(`Chapter ${chapter} not found in ${bookName}`, 404);
  }
}

export default ChapterNotFoundException;
