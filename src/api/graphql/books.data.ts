export interface Book {
  type: 'Book';
  name: string;
  abbrev: string;
  chapters: ReadonlyArray<readonly string[]>;
}

// export const getBookByName = (name: string) => {

// }
