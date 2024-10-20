import EditImageEditingScreen from '@/app/ui/drawing/EditImageEditingScreen';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Edit',
} as const;
// ------------------ end :: metadata ------------------

type EditCanvasPageProps = {
  params: { id: string };
};

const EditCanvasPage = ({ params }: EditCanvasPageProps) => <EditImageEditingScreen id={params.id} />;

export default EditCanvasPage;
