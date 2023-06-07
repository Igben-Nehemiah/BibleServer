import BooksRepository from './api/modules/books/repositories/books.repository';

export const populateBooksForGraphQl = async (
  booksRepository: BooksRepository
) => {
  async function _populateBooksForGraphQl() {
    const result = await booksRepository.getAll();
    return result.map(b => {
      return {
        type: 'Book',
        id: b.name,
        name: b.name,
        abbrev: b.abbrev,
        chapters: b.chapters,
      };
    });
  }

  return await _populateBooksForGraphQl();
};
