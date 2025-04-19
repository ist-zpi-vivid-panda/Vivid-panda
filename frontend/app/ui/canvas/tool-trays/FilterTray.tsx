import { Dispatch, SetStateAction } from 'react';

import { FilterType } from '@/app/lib/canvas/filters/filter';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { getEnumValues } from '@/app/lib/utilities/enums';
import { Button } from '@mui/material';

type FilterTrayProps = {
  setFilterType: Dispatch<SetStateAction<FilterType | undefined>>;
};

const filters = getEnumValues(FilterType);

const FilterTray = ({ setFilterType }: FilterTrayProps) => {
  const { t } = useStrings(TranslationNamespace.FILTERS);

  return (
    <>
      {filters.map((filterType) => (
        <Button
          sx={{ display: 'flex', flex: 1, width: '100%' }}
          variant="contained"
          key={filterType}
          onClick={() => setFilterType(filterType as FilterType)}
        >
          {t(filterType)}
        </Button>
      ))}
    </>
  );
};

export default FilterTray;
