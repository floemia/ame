import { Locale } from 'discord.js';
/**
 * Used to throw errors in commands and return the error in the response container.
 */
export class AmeError extends Error {
  /**
   * The language to show the error message in.
   */
  locale: Locale;

  constructor(message: string, locale?: Locale) {
    super(message);
    this.locale = locale || Locale.EnglishUS;
  }
}
