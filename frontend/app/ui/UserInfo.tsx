'use client';

import { useCallback, useMemo } from 'react';

import useUserData from '@/app/lib/storage/useUserData';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { DropdownItemProps } from './shared/dropdown/DropdownItem';
import DropdownMenu from './shared/dropdown/DropdownMenu';
import { useUserInfo, useUserProfilePicture } from '../lib/api/userApi';

const UserInfo = () => {
  const { logout } = useUserData();
  const { email, username } = useUserInfo().data;
  const { data: profilePicture } = useUserProfilePicture().data;
  const router = useRouter();

  const navigateToImages = useCallback(() => {
    router.push('/files/list');
  }, [router]);

  const dropdownOptions: DropdownItemProps[] = useMemo(
    () => [
      { label: 'Logout', onSelect: logout },
      { label: 'Images', onSelect: navigateToImages },
    ],
    [logout, navigateToImages]
  );

  return (
    <div className="primaryBackground flex flex-row fixed top-0 right-0 p-3 rounded-bl-xl">
      <div className="flex flex-col flex-wrap">
        <span>{username}</span>
        <span className="font-light">{email}</span>

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
