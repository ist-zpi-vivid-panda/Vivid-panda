'use client';

import React, { FormEvent } from 'react';

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
        <Link href="/">
          <BackArrow size={40} />
        </Link>
      </div>

      <div className="flex justify-end items-center min-h-screen w-full">
        <div
          className="flex flex-col justify-center items-center w-full md:w-1/3 lg:w-1/4 px-5 py-10 mr-40"
          style={{ marginBottom: '60vh' }}
        >
          <form
            className={`${cardClassName} p-10 gap-5 shadow-2xl flex flex-col items-center w-full`}
            onSubmit={onSubmit}
          >
            <span className="text-center custom-text">Vivid Panda</span>

            <div className="flex flex-col custom-gap w-full">
              {React.Children.map(children, (child) => (
                <div className="w-full">{child}</div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
