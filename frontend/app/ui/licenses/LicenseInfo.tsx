import { License } from '@/app/lib/licenses/definitions';

type LicenseInfoProps = {
  license?: License;
};

const LicenseInfo = ({ license }: LicenseInfoProps) => {
  return (
    <div style={{ flex: 2, padding: '1rem' }}>
      <h2>License Information</h2>

      <div>
        {license ? (
          <>
            <p>
              <strong>License:</strong> {license.licenses}
            </p>

            <p>
              <strong>URL: </strong>
              <a href={license.repository} target="_blank" rel="noopener noreferrer">
                {license.repository}
              </a>
            </p>

            <p>
              <strong>Copyright: </strong>
              {license.copyright}
            </p>

            <br />

            <p>{license.licenseText || 'No license text available.'}</p>
          </>
        ) : (
          <p>No license is chosen</p>
        )}
      </div>
    </div>
  );
};

export default LicenseInfo;
