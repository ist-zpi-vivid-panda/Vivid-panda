'use client';

import { FormEvent } from 'react';

import { Children } from '@/app/lib/definitions';
import BackArrow from '@/app/ui/shared/BackArrow';
import { cardClassName } from '@/app/ui/shared/Card';
import Link from 'next/link';

type AuthPageProps = {
  onSubmit: (props: FormEvent) => void;
  children: Children;
};
const Auth = ({ onSubmit, children }: AuthPageProps) => {
  return (
    <>
      <div className="p-10">
        <Link href="/dashboard">
          <BackArrow size={40} />
        </Link>
      </div>

      <div className="flex px-20 py-10 pb-40 absolute inset-y-0 right-0 items-center flex-col">
        <form className={`${cardClassName} p-10 gap-5 shadow-2xl`} onSubmit={onSubmit}>
          <span className="text-6xl p-10">Vivid Panda</span>
          {children}
        </form>
      </div>
    </>
  );
};

export default Auth;
