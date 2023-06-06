import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const BookType: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'Book',
  description: 'A book of the bible',
  fields: () => ({
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
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      type: BookType,
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
  query: query..Type,
  types: [BookType],
});
function getBookByName(name: any) {
  throw new Error('Function not implemented.');
}
