import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { getBookByName, getBookChapters } from '../../../../server';

const bookType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Book',
  description: 'A book of the bible',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the book.',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the book',
    },
    abbrev: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The abbreviation of the book',
    },
    chapters: {
      type: new GraphQLList(new GraphQLList(GraphQLString)),
      resolve: book => getBookChapters(book),
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      type: bookType,
      args: {
        name: {
          description: 'Name of book',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { name }) => {
        return getBookByName(name);
      },
    },
  }),
});

export const BookSchema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  types: [bookType],
});
