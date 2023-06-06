import { graphql } from 'graphql';
import { BookSchema } from './book.schema';
import { Book, getBookByName } from './books.data';
import express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const root = {
  book: ({ name }: { name: string }) => {
    const bookData = getBookByName(name);
    return bookData;
  },
};

// GraphQL endpoint
app.post('/graphql', (req, res) => {
  const variables = req.body.variables;
  const query = req.body.query;

  graphql({
    schema: BookSchema,
    source: query,
    // rootValue: root,
    variableValues: variables,
  })
    .then(result => {
      if (result.data == null || result.data == undefined) return;

      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
