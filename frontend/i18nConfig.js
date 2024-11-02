import { SupportedLocale } from './app/lib/internationalization/definitions';
import { getEnumValues } from './app/lib/utilities/enums';

const i18Config = {
  locales: getEnumValues(SupportedLocale),
  defaultLocale: SupportedLocale.en,
};

export default i18Config;
