const throwIfNull = <T>(value: T) => {
    if (value === null){
        throw new Error();
    }
}

export default throwIfNull;