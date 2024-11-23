import { SupportedLocale } from './app/lib/internationalization/definitions';
import { DEFAULT_LOCALE } from './app/lib/internationalization/utils';
import { getEnumValues } from './app/lib/utilities/enums';

const i18Config = {
  locales: getEnumValues(SupportedLocale),
  defaultLocale: DEFAULT_LOCALE,
};

export default i18Config;
