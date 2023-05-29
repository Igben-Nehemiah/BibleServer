import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
  });
}

export default validateEnv;
