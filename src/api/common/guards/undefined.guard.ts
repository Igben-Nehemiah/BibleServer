
export const throwIfUndefined = <T>(value: T | undefined) => {
  if (value === undefined) {
    throw new Error()
  }
}
