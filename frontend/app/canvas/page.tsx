import ImageEditingScreen from '@/app/ui/drawing/ImageEditingScreen';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Canvas',
};
// ------------------ end :: metadata ------------------

const CanvasPage = () => <ImageEditingScreen />;

export default CanvasPage;
