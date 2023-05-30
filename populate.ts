import BookModel from './src/api/modules/books/models/book.model';
import * as kjv from './en_kjv.json';

export const populateBooks = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error();
    await BookModel.deleteMany();
    const books = await BookModel.exists({});

    if (books == null) await BookModel.create(kjv);

    console.log('Books populated');
    process.exit(0);
  } catch (error: unknown) {
    console.log(error);
    process.exit(1);
  }
};
