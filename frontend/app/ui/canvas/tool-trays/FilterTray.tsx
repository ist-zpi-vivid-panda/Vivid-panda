import { Dispatch, SetStateAction } from 'react';

import { FilterType } from '@/app/lib/canvas/filters/filter';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { getEnumValues } from '@/app/lib/utilities/enums';

type FilterTrayProps = {
  setFilterType: Dispatch<SetStateAction<FilterType | undefined>>;
};

const filters = getEnumValues(FilterType);

const FilterTray = ({ setFilterType }: FilterTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Filters);

  return (
    <div className="text-large-edit">
      {filters.map((filterType) => (
        <button key={filterType} onClick={() => setFilterType(filterType as FilterType)}>
          {t(filterType)}
        </button>
      ))}
    </div>
  );
};

export default FilterTray;
