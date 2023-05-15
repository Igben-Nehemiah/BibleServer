import express from 'express';
import {
  graphql,
} from 'graphql';
import { BookSchema } from './book.schema';


const app = express();

const source = "{ hello }";

graphql({ BookSchema, source})
  .then(result => {
    console.log(result);
})