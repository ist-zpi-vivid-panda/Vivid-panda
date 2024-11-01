import { Dispatch, SetStateAction } from 'react';

import { FilterType } from '@/app/lib/canvas/filters/filter';
import { getEnumValues } from '@/app/lib/utilities/enums';

type FilterTrayProps = {
  setFilterType: Dispatch<SetStateAction<FilterType | undefined>>;
};

const FilterTray = ({ setFilterType }: FilterTrayProps) => {
  return (
    <div>
      {getEnumValues(FilterType).map((filterType) => (
        <button key={filterType} onClick={() => setFilterType(filterType as FilterType)}>
          {filterType}
        </button>
      ))}
    </div>
  );
};

export default FilterTray;
