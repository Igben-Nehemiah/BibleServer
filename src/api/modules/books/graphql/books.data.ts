export interface Book {
  type: 'Book';
  id: string;
  name: string;
  abbrev: string;
  chapters: Array<Array<string>>;
}
