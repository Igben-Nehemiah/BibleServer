class Result<T>{
    public readonly isFailure: boolean;

    constructor(
        public readonly data: T,
        public readonly isSuccess: boolean,
        public readonly errors: string | string[] | null  = null
        ) {
        this.errors = errors;
        this.isSuccess = isSuccess;
        this.isFailure = !this.isSuccess;
    }
}

export default Result;