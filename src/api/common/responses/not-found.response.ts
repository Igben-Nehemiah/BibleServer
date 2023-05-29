import { Response } from './base.response';

export class NotFound<T> extends Response<T> {
  constructor(error?: string) {
    super(404, null, error ?? 'Resource not found');
  }
}
