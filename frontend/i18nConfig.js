import { SupportedLocale } from './app/lib/internationalization/definitions';
import { getDefaultLocale } from './app/lib/internationalization/utils';
import { getEnumValues } from './app/lib/utilities/enums';

const i18Config = {
  locales: getEnumValues(SupportedLocale),
  defaultLocale: getDefaultLocale(),
};

export default i18Config;
