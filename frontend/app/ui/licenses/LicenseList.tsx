'use client';

import { useState } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { readLicenses } from '@/app/lib/licenses/licenseReader';

import LicenseInfo from './LicenseInfo';

const licenses = readLicenses();

const LicenseList = () => {
  const { t } = useStrings(TranslationNamespace.Licenses);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'scroll', borderRight: '1px solid #ddd', padding: '1rem' }}>
        <h2>{t('licenses')}</h2>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {licenses.map((license, index) => (
            <li key={license.key} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setSelectedIndex(index)}
                style={{
                  background: selectedIndex === index ? '#0070f3' : 'transparent',
                  color: selectedIndex === index ? '#fff' : '#000',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {license.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <LicenseInfo license={selectedIndex !== null ? licenses[selectedIndex] : undefined} />
    </div>
  );
};

export default LicenseList;
