import { ResponseStrings } from '@localization';
import { SpanishStrings } from '@localization/languages';

export abstract class LocalizationHelper {
  static getLocaleStrings(locale: string) {
    if (locale.startsWith('es')) return new SpanishStrings();
    else return new ResponseStrings();
  }
}
