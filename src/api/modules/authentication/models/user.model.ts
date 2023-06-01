import mongoose from 'mongoose';
import { type User } from '../interfaces';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isTwoFactorAuthenticationEnabled: Boolean,
  twoFactorAuthenticationCode: String,
});

const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default UserModel;
