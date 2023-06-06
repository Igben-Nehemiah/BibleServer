export interface Book {
  type: 'Book';
  id: string;
  name: string;
  abbrev: string;
  chapters: ReadonlyArray<ReadonlyArray<string>>;
}

const books: Array<Book> = [];

function getBooksData(books: Array<Book>) {
  const booksData: { [name: string]: Book } = {};

  books.forEach(book => {
    booksData[book.name] = book;
  });

  return booksData;
}

const booksData = getBooksData(books);

export function getBookByName(bookName: string): Promise<Book | null> {
  return Promise.resolve(booksData[bookName]) ?? null;
}
