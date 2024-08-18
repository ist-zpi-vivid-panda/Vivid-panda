import { ChildrenProp } from '@/app/lib/definitions';

const AuthLayout = ({ children }: ChildrenProp) => (
  <div className="bg-left min-h-screen logoBackground">
      {children}
  </div>
);

export default AuthLayout;
