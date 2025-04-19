import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import NewImageEditingScreen from '@/app/ui/canvas/NewImageEditingScreen';

export const generateMetadata = generateMetadataFunctor('new');

const NewCanvasPage = () => <NewImageEditingScreen />;

export default NewCanvasPage;
