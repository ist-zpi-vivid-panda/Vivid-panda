import { Metadata } from 'next';

import NewImageEditingScreen from '../../ui/canvas/NewImageEditingScreen';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'New',
} as const);
// ------------------ end :: metadata ------------------

const NewCanvasPage = () => <NewImageEditingScreen />;

export default NewCanvasPage;
