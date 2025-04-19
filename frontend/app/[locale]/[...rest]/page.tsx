import React from 'react';

import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import NotFoundError from '@/app/ui/errors/NotFoundError';

export const generateMetadata = generateMetadataFunctor('error');

const NotFoundPage = () => <NotFoundError />;

export default NotFoundPage;
