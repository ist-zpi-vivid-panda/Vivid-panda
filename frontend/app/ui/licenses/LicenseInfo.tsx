import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { License } from '@/app/lib/licenses/definitions';

type LicenseInfoProps = {
  license?: License;
};

const LicenseInfo = ({ license }: LicenseInfoProps) => {
  const { t } = useStrings(TranslationNamespace.Licenses);

  return (
    <div style={{ flex: 2, padding: '1rem' }}>
      <h2>{t('license_details')}:</h2>

      <div>
        {license ? (
          <>
            <p>
              <strong>{t('license')}: </strong> {license.licenses}
            </p>

            <p>
              <strong>URL: </strong>
              <a href={license.repository} target="_blank" rel="noopener noreferrer">
                {license.repository}
              </a>
            </p>

            <p>
              <strong>{t('copyright')}: </strong>
              {license.copyright}
            </p>

            <br />

            <p>{license.licenseText || t('no_license_text')}</p>
          </>
        ) : (
          <p>{t('no_license_chosen')}</p>
        )}
      </div>
    </div>
  );
};

export default LicenseInfo;
