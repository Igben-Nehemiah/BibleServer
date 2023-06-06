export interface Book {
  type: 'Book';
  id: string;
  name: string;
  abbrev: string;
  chapters: ReadonlyArray<ReadonlyArray<string>>;
}

const books: Array<Book> = [
  {
    type: 'Book',
    id: '12345',
    name: 'Sample Book',
    abbrev: 'SB',
    chapters: [
      ['Chapter 1', 'Chapter 2'],
      ['Chapter 3', 'Chapter 4'],
      ['Chapter 5', 'Chapter 6'],
    ],
  },
];

function getBooksData(books: Array<Book>) {
  const booksData: { [name: string]: Book } = {};

  books.forEach(book => {
    booksData[book.name] = book;
  });

  return booksData;
}

const booksData = getBooksData(books);

export function getAllBooks() {
  return books;
}

export function getBookByName(bookName: string): Promise<Book | null> {
  return Promise.resolve(booksData[bookName]) ?? null;
}

export function getBookChapters(book: Book) {
  return book.chapters;
}
