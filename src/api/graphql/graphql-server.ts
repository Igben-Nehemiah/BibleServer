import { graphql } from 'graphql';
import { BookSchema } from './book.schema';
import { Book } from './books.data';

const source = `
  query GetBook($name: String!) {
    book(name: $name) {
      name,
      chapters
    }
  }
`;

const variables = {
  name: 'Sample Book',
};

graphql({ schema: BookSchema, source, variableValues: variables })
  .then(result => {
    if (result.data == null || result.data == undefined) return;
    const book = result.data.book as Book;
    const chapters = book.chapters;

    console.log('Book name: ', book.name);
    console.log('Book:', book);
    console.log('Chapters:', chapters);
  })
  .catch(e => {
    console.log(e);
  });
