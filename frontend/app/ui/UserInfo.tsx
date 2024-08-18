'use client';

import useUserData from '@/storage/useUserData';
import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa6';

const UserInfo = () => {
  const { userName, email, profilePicture } = useUserData();

  return (
    <div className="primaryBackground flex flex-row fixed top-0 right-0 p-3 rounded-bl-xl">
      <div className="flex flex-col flex-wrap">
        <span>{userName || 'userName'}</span>
        <span className="font-light">{email || 'test-email@vivid-panda.com'}</span>

        <div className="flex flex-row flex-wrap items-center gap-2">
          <FaChevronDown
            onClick={() => {
              console.log('open options');
            }}
          />
          <span>Options</span>
        </div>
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
