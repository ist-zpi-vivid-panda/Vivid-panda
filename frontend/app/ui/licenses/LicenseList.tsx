'use client';

import { useState } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { readLicenses } from '@/app/lib/licenses/licenseReader';
import useCurrentMode from '@/app/lib/theme/useCurrentMode';
import { Box, Button } from '@mui/material';

import LicenseInfo from './LicenseInfo';
import ResponsiveTypography from '../themed/ResponsiveTypography';

const licenses = readLicenses();

const LicenseList = () => {
  const { t } = useStrings(TranslationNamespace.Licenses);
  const mode = useCurrentMode();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
        <ResponsiveTypography>{t('licenses')}:</ResponsiveTypography>

        <Box sx={{ flex: 1, overflowY: 'scroll' }}>
          <Box>
            {licenses.map((license, index) => (
              <Button
                key={license.key}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  backgroundColor: selectedIndex === index ? 'primary.main' : 'transparent',
                  color:
                    selectedIndex === index
                      ? 'primary.contrastText'
                      : mode === 'dark'
                        ? 'secondary.main'
                        : 'primary.main',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: '100%',
                  p: 1,
                  px: 2,
                  wordWrap: 'break-word',
                  textAlign: 'left',
                  whiteSpace: 'normal',
                }}
              >
                <ResponsiveTypography>{license.name}</ResponsiveTypography>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <LicenseInfo license={selectedIndex !== null ? licenses[selectedIndex] : undefined} />
    </Box>
  );
};

export default LicenseList;
