'use client';

import defaultImage from '@/public/vivid-panda.png';
import useUserData from '@/storage/useUserData';
import Image from 'next/image';

const UserInfo = () => {
  const { userName, email, profilePicture } = useUserData();

  return (
    <div className="fixed bottom-0 left-0 flex h-48 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
      <div className="flex-col">
        <span className="profile-name">{userName || 'userName'}</span>
        <span className="profile-email">{email || 'email'}</span>
      </div>
      <div className="top-bar-right">
        <div className="profile-pic">
          <Image
            src={profilePicture ? `data:image/jpeg;base64,${profilePicture}` : defaultImage}
            alt="Profile"
            width={100}
            height={24}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
