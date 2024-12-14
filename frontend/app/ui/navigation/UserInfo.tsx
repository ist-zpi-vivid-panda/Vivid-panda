'use client';

import { useCallback, useMemo, useState } from 'react';

import useUserData from '@/app/lib/storage/useUserData';
import { imageStrToBase64Typed } from '@/app/lib/utilities/image';
import { Menu, MenuItem, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useUserInfo, useUserProfilePicture } from '../../lib/api/userApi';
import { TranslationNamespace } from '../../lib/internationalization/definitions';
import useStrings from '../../lib/internationalization/useStrings';

const UserInfo = () => {
  const { logout } = useUserData();
  const { email, username } = useUserInfo().data;
  const { data: profilePicture } = useUserProfilePicture().data;
  const router = useRouter();
  const { t } = useStrings(TranslationNamespace.AUTH);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const navigateToImages = useCallback(() => {
    handleCloseMenu();
    router.push('/files/list');
  }, [handleCloseMenu, router]);

  const navigateToEdit = useCallback(() => {
    handleCloseMenu();
    router.push('/canvas/new');
  }, [handleCloseMenu, router]);

  const navigateToLicenses = useCallback(() => {
    handleCloseMenu();
    router.push('/licenses/list');
  }, [handleCloseMenu, router]);

  const handleLogout = useCallback(() => {
    handleCloseMenu();
    logout();
  }, [handleCloseMenu, logout]);

  const dropdownOptions = useMemo(
    () => [
      { label: t('files:images'), onClick: navigateToImages },
      { label: t('common:edit'), onClick: navigateToEdit },
      { label: t('licenses:licenses'), onClick: navigateToLicenses },
      { label: t('logout'), onClick: handleLogout },
    ],
    [navigateToImages, navigateToEdit, t, handleLogout, navigateToLicenses]
  );

  return (
    <div className="primaryBackground flex flex-row fixed top-0 right-0 p-3 rounded-bl-xl z-50">
      <div className="flex flex-col flex-wrap">
        <span>{username}</span>
        <span className="font-light">{email}</span>

        <Button onClick={handleOpenMenu} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
          {t('common:options')}
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {dropdownOptions.map((option, index) => (
            <MenuItem key={index} onClick={option.onClick}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <Image
        className="rounded-full ml-3"
        src={profilePicture ? imageStrToBase64Typed(profilePicture) : '/logo.png'}
        alt="Profile"
        width={75}
        height={75}
        priority
      />
    </div>
  );
};

export default UserInfo;
