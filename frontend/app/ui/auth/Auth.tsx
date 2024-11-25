'use client';

import React, { FormEvent, useState } from 'react';

import { Children } from '@/app/lib/definitions';
import BackArrow from '@/app/ui/shared/BackArrow';
import { Box, Card, Typography } from '@mui/material';
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

      <Box sx={{ px: 5, py: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Link href="/">
          <BackArrow />
        </Link>

        <LocaleChangeButton setAnchorEl={setAnchorElLang} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'right',
          marginRight: '10vw',
        }}
      >
        <Card
          sx={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          component="form"
          onSubmit={onSubmit}
        >
          <Typography variant="h4">Vivid Panda</Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {React.Children.map(children, (child) => (
              <>{child}</>
            ))}
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Auth;
