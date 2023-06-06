import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { getBookByName } from './books.data';

const bookType: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'Book',
  description: 'A book of the bible',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the human.',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the book',
    },
    abbrev: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The abbrevation of the book',
    },
    chapters: {
      type: new GraphQLList(new GraphQLList(GraphQLString)),
    },
  }),
  resolveType(book) {
    return ''; // TODO: Correct later
  },
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
        getBookByName(name);
      },
    },
  }),
});

export const BookSchema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  types: [bookType],
});
