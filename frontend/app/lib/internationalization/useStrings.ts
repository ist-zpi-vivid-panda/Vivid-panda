import { useTranslation } from 'react-i18next';

import { TranslationNamespace } from './definitions';

const useStrings = (namespace: TranslationNamespace) => useTranslation(namespace);

export default useStrings;
