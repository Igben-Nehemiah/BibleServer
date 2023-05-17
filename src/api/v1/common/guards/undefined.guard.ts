
const throwIfUndefined = <T>(value: T) => {
    if (value === undefined) {
        throw new Error();
    };
};

export default throwIfUndefined;