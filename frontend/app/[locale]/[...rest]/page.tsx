import React from 'react';

import NotFoundError from '@/app/ui/errors/NotFoundError';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'Error',
} as const);
// ------------------ end :: metadata ------------------

const NotFoundPage = () => <NotFoundError />;

export default NotFoundPage;
