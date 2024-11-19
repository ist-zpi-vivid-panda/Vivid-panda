'use client';

import { useCallback, useMemo, useState } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { FaBars } from 'react-icons/fa6';

import AvatarOptions from './AvatarOptions';
import LocaleChangeButton from '../locale/LocaleChangeButton';
import LocaleChanger from '../locale/LocaleChanger';

const TopAppBar = () => {
  const { t } = useStrings(TranslationNamespace.Auth);

  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget),
    []
  );

  const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);

  const handleOption = useCallback(
    (optionClick: () => void) => () => {
      handleCloseNavMenu();
      optionClick();
    },
    [handleCloseNavMenu]
  );

  const navigateToImages = useCallback(() => router.push('/files/list'), [router]);

  const navigateToEdit = useCallback(() => router.push('/canvas/new'), [router]);

  const dropdownOptions = useMemo(
    () => [
      { label: t('files:images'), onClick: navigateToImages },
      { label: t('common:edit'), onClick: navigateToEdit },
    ],
    [navigateToEdit, navigateToImages, t]
  );

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Vivid Panda
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <FaBars />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {dropdownOptions.map((option) => (
                <MenuItem key={option.label} onClick={handleOption(option.onClick)}>
                  <Typography sx={{ textAlign: 'center' }}>{option.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Vivid Panda
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {dropdownOptions.map((option) => (
              <Button
                key={option.label}
                onClick={handleOption(option.onClick)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {option.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
            <LocaleChangeButton setAnchorEl={setAnchorElLang} />

            <LocaleChanger anchorEl={anchorElLang} setAnchorEl={setAnchorElLang} />

            <AvatarOptions />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopAppBar;
