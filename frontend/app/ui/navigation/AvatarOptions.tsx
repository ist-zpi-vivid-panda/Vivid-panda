'use client';

import { useCallback, useMemo, useState } from 'react';

import { useUserProfilePicture } from '@/app/lib/api/userApi';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import useUserData from '@/app/lib/storage/useUserData';
import { imageStrToBase64Typed } from '@/app/lib/utilities/image';
import { Menu, MenuItem, Typography, Tooltip, IconButton, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';

const AvatarOptions = () => {
  const router = useRouter();

  const { data: profilePicture } = useUserProfilePicture().data;
  const { logout } = useUserData();

  const { t } = useStrings(TranslationNamespace.AUTH);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

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
      { label: t('licenses:licenses'), onClick: navigateToLicenses },
      { label: t('logout'), onClick: handleLogout },
    ],
    [t, handleLogout, navigateToLicenses]
  );

  return (
    <>
      <Tooltip title={t('options')}>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar
            alt="avatar"
            src={profilePicture ? imageStrToBase64Typed(profilePicture) : '/logo.png'}
            sx={{ width: 64, height: 64 }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {dropdownOptions.map((option, index) => (
          <MenuItem key={index} onClick={option.onClick}>
            <Typography sx={{ textAlign: 'center' }}>{option.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AvatarOptions;
