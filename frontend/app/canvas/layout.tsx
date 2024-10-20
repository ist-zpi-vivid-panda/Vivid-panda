import { ChildrenProp } from '@/app/lib/definitions';
import UserInfo from '@/app/ui/UserInfo';

const CanvasLayout = ({ children }: ChildrenProp) => (
  <div className="min-h-screen flex flex-col">
    <nav>
      <UserInfo />
    </nav>
    {children}
  </div>
);

export default CanvasLayout;
