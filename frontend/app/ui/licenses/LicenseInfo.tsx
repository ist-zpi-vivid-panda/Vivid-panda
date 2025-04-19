import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { License } from '@/app/lib/licenses/definitions';
import { Box } from '@mui/material';

import ResponsiveTypography from '../themed/ResponsiveTypography';

type LicenseInfoProps = {
  license?: License;
};

const LicenseInfo = ({ license }: LicenseInfoProps) => {
  const { t } = useStrings(TranslationNamespace.LICENSES);

  return (
    <Box sx={{ flex: 2, padding: '1rem' }}>
      <ResponsiveTypography>{t('license_details')}:</ResponsiveTypography>

      <Box>
        {license ? (
          <>
            <ResponsiveTypography>
              <strong>{t('license')}: </strong> {license.licenses}
            </ResponsiveTypography>

            <ResponsiveTypography>
              <strong>URL: </strong>
              <a href={license.repository} target="_blank" rel="noopener noreferrer">
                {license.repository}
              </a>
            </ResponsiveTypography>

            <ResponsiveTypography>
              <strong>{t('copyright')}: </strong>
              {license.copyright}
            </ResponsiveTypography>

            <br />

            <ResponsiveTypography>{license.licenseText || t('no_license_text')}</ResponsiveTypography>
          </>
        ) : (
          <ResponsiveTypography>{t('no_license_chosen')}</ResponsiveTypography>
        )}
      </Box>
    </Box>
  );
};

export default LicenseInfo;
