import { Response } from './base.response';

export class NotAuthorised<T> extends Response<T> {
  constructor(error?: string) {
    super(401, null, error ?? 'Not authorised');
  }
}
