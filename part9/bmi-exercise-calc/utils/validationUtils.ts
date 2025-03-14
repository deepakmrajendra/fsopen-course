export const isNotNumber = (argument: unknown): boolean => {
    if (typeof argument !== "string" && typeof argument !== "number") {
      return true; // If not a string or number, it's "not a number"
    }
    return isNaN(Number(argument));
  };