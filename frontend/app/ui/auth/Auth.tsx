'use client';

import React, { FormEvent, useState } from 'react';

import { Children } from '@/app/lib/definitions';
import BackArrow from '@/app/ui/shared/BackArrow';
import { cardClassName } from '@/app/ui/shared/Card';
import Link from 'next/link';

import LocaleChangeButton from '../locale/LocaleChangeButton';
import LocaleChanger from '../locale/LocaleChanger';

type AuthPageProps = {
  onSubmit: (props: FormEvent) => void;
  children: Children;
};

const Auth = ({ onSubmit, children }: AuthPageProps) => {
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  return (
    <>
      <LocaleChanger anchorEl={anchorElLang} setAnchorEl={setAnchorElLang} />

      <div className="px-10 py-4 flex flex-row justify-between">
        <Link href="/">
          <BackArrow size={40} />
        </Link>

        <LocaleChangeButton setAnchorEl={setAnchorElLang} />
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
