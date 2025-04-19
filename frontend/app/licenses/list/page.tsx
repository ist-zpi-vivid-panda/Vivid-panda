import LicenseList from '@/app/ui/licenses/LicenseList';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'Licenses',
} as const);
// ------------------ end :: metadata ------------------

const LicenseListPage = () => <LicenseList />;

export default LicenseListPage;
