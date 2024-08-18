import Canvas from '@/app/ui/drawing/Canvas';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Canvas',
};
// ------------------ end :: metadata ------------------

const CanvasScreen = () => <ImageEditingScreen />;

export default CanvasScreen;
