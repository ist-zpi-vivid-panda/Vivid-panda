import { ChildrenProp } from '@/app/lib/definitions';
import UserInfo from '@/app/ui/UserInfo';

const LicenseLayout = ({ children }: ChildrenProp) => (
  <div className="min-h-screen flex flex-row">
    <nav>
      <UserInfo />
    </nav>
    {children}
  </div>
);

export default LicenseLayout;
