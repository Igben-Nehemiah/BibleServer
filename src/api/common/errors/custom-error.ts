class HttpException extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

const createCustomError = (msg: string, statusCode: number) => {
  return new HttpException(msg, statusCode);
};

export { createCustomError, HttpException };
