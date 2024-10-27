import EditImageEditingScreen from '@/app/ui/drawing/EditImageEditingScreen';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Edit',
} as const;
// ------------------ end :: metadata ------------------

type EditCanvasPageProps = {
  params: Promise<{ id: string }>;
};

const EditCanvasPage = async ({ params }: EditCanvasPageProps) => {
  const { id } = await params;

  return <EditImageEditingScreen id={id} />;
};

export default EditCanvasPage;
