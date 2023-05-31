export class Response<T> {
  public readonly isSuccessful: boolean;
  public readonly isNotSuccessful: boolean;

  constructor(
    public readonly code: number,
    public readonly data: T | null = null,
    public readonly error: string | null = null,
    public readonly message: string | null = null
  ) {
    this.isSuccessful = code < 400 && code >= 100 && error === null;
    this.isNotSuccessful = !this.isSuccessful;
  }
}
