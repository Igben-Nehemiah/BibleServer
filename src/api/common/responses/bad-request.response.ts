import { Response } from './base.response'

export class BadRequest<T> extends Response<T> {
  constructor (error?: string) {
    super(400, null, error ?? 'Bad request')
  }
}
