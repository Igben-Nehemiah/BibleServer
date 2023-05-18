export class BaseResult{
    public readonly isFailure: boolean;

    constructor(
        public readonly isSuccess: boolean,
        public readonly error: string | null  = null
        ) {
        this.error = error;
        this.isSuccess = isSuccess;
        this.isFailure = !this.isSuccess;
    }
}

class Result<T> extends BaseResult{
    public readonly isFailure: boolean;

    constructor(
        public readonly data: T | null,
        public readonly isSuccess: boolean,
        public readonly error: string | null  = null
        ) {
        super(isSuccess, error)
        this.isFailure = !this.isSuccess;
    }
}


export default Result;