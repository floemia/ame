/**
 * Used to throw errors in commands and return the error in the response container.
 */
export class AmeError extends Error {
  constructor(message: string) {
    super(message);
  }
}
