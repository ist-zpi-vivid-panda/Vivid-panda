import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import EditImageEditingScreen from '@/app/ui/canvas/EditImageEditingScreen';

type EditCanvasPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = generateMetadataFunctor('edit');

const EditCanvasPage = async ({ params }: EditCanvasPageProps) => {
  const { id } = await params;

  return <EditImageEditingScreen id={id} />;
};

export default EditCanvasPage;
