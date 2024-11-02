'use client';

import licenses from '@/public/licenses.json';

import { License } from './definitions';

export const readLicenses = (): License[] =>
  Object.entries(licenses).map(([key, value]) => {
    const license = value as unknown as License;

    return {
      key,
      licenses: license.licenses,
      repository: license.repository,
      publisher: license.publisher,
      email: license.email,
      url: license.url,
      name: license.name,
      version: license.version,
      licenseText: license.licenseText,
      copyright: license.copyright,
    };
  });
