import { cleanEnv, num, port, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
    SALT_ROUNDS: num(),
    JWT_SECRET: str(),
    JWT_ALGORITHM: str(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
  });
}

export default validateEnv;
