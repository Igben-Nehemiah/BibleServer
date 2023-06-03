export interface BookResponse {
  book: string;
  abbreviation: string;
  chapter: number;
  verse: number | string;
  data: string | string[];
  totalNumberOfVerses: number;
  totalNumberOfChapters: number;
}
