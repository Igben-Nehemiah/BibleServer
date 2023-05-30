/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from 'mongoose';

export const connectToDatabase = () => {
  const { MONGO_URI } = process.env;

  mongoose
    .connect(MONGO_URI ?? '')
    .then(_ => {
      console.log('Connected to db successfully! ');
    })
    .catch(() => {
      console.error('Failed to connect to db');
    });
};
