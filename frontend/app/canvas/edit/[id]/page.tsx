import EditImageEditingScreen from '@/app/ui/drawing/EditImageEditingScreen';
import { Metadata } from 'next';

type EditCanvasPageProps = {
  params: Promise<{ id: string }>;
};

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'Edit',
} as const);
// ------------------ end :: metadata ------------------

const EditCanvasPage = async ({ params }: EditCanvasPageProps) => {
  const { id } = await params;

  return <EditImageEditingScreen id={id} />;
};

export default EditCanvasPage;
