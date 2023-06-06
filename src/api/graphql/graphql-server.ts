import express from 'express';
import { graphql } from 'graphql';
import { BookSchema } from './book.schema';

const app = express();

const source = `
  query BookNameQuery {
    book {
      name
    }
  }`;

graphql({ schema: BookSchema, source })
  .then(result => {
    console.log(result);
  })
  .catch(e => {
    console.log(e);
  });

console.log(app);
