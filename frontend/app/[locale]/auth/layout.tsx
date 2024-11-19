'use client'; // Mark this component as a client component

import { ChildrenProp } from '@/app/lib/definitions';

const AuthLayout = ({ children }: ChildrenProp) => {
  return (
    <div
      className="bg-left min-h-screen logoBackground"
      style={{
        width: '100%', // Full width
        height: '100vh', // Full viewport height
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
