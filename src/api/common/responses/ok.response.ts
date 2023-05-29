import { Response } from './base.response'

export class Ok<T> extends Response<T> {
  constructor (data?: T, statusCode: 200 | 201 = 200) {
    super(statusCode, data)
  }
}
