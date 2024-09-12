'use client';

import { useMemo } from 'react';

import useUserData from '@/app/lib/storage/useUserData';
import Image from 'next/image';

import { DropdownItemProps } from './shared/dropdown/DropdownItem';
import DropdownMenu from './shared/dropdown/DropdownMenu';

const UserInfo = () => {
  const { userName, email, profilePicture, logout } = useUserData();

  const dropdownOptions: DropdownItemProps[] = useMemo(() => [{ label: 'Logout', onSelect: logout }], [logout]);

  return (
    <div className="primaryBackground flex flex-row fixed top-0 right-0 p-3 rounded-bl-xl">
      <div className="flex flex-col flex-wrap">
        <span>{userName || 'userName'}</span>
        <span className="font-light">{email || 'test-email@vivid-panda.com'}</span>

        <DropdownMenu options={dropdownOptions} text={'Options'} />
      </div>

      <Image
        className="rounded-full ml-3"
        src={profilePicture ? `data:image/jpeg;base64,${profilePicture}` : '/logo.png'}
        alt="Profile"
        width={75}
        height={75}
        priority
      />
    </div>
  );
};

export default UserInfo;
