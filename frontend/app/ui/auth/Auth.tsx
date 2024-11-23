'use client';

import React, { FormEvent, useState } from 'react';

import { Children } from '@/app/lib/definitions';
import BackArrow from '@/app/ui/shared/BackArrow';
import { Box, Card, Container, Typography } from '@mui/material';
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
          <BackArrow />
        </Link>

        <LocaleChangeButton setAnchorEl={setAnchorElLang} />
      </div>

      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-end', md: 'flex-end' },
          alignItems: 'flex-start',
          padding: 0,
        }}
      >
        <Card
          className="custom-card"
          sx={{
            '@media (max-width: 700px)': {
              width: '40vw',
              height: '80vh',
              marginTop: '-13vh',
              marginRight: '15vw',
            },
            '@media (min-width: 700px) and (max-width: 1366px)': {
              width: '40vw',
              height: '85vh',
              marginTop: '-5vh',
              marginRight: '8vw',
            },

            '@media (min-width: 1366px) and (max-width: 1920px)': {
              width: '30vw',
              height: '70vh',
              marginTop: '3vh',
              marginRight: '-3vw',
            },

            '@media (min-width: 1920px) and (max-width: 2560px)': {
              width: '30vw',
              height: '80vh',
              marginTop: '3vh',
              marginRight: '-10vw',
            },

            '@media (min-width: 2560px)': {
              width: '60%',
              height: '78vh',
              marginTop: '5vh',
              marginRight: '-17vw',
            },
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 24,
          }}
          component="form"
          onSubmit={onSubmit}
        >
          <Typography
            sx={{
              '@media (max-width: 400px)': {
                fontSize: '0.5rem',
              },
              '@media (min-width: 700px) and (max-width: 1366px)': {
                fontSize: '2rem',
              },

              '@media (min-width: 1366px) and (max-width: 1920px)': {
                fontSize: '3rem',
              },

              '@media (min-width: 1920px) and (max-width: 2560px)': {
                fontSize: '4rem',
              },

              '@media (min-width: 2560px)': {
                fontSize: '4.5rem',
              },
            }}
          >
            Vivid Panda
          </Typography>

          <Box
            className="custom-gap"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {React.Children.map(children, (child) => (
              <Box
                sx={{
                  width: '100%',
                  '@media (max-width: 400px)': {
                    gap: '1rem',
                  },
                  '@media (min-width: 700px) and (max-width: 1366px)': {
                    gap: '1.5rem',
                  },
                  '@media (min-width: 1366px)': {
                    gap: '2rem',
                  },
                }}
              >
                {child}
              </Box>
            ))}
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Auth;
