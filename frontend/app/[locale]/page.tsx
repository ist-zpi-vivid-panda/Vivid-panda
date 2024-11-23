import { Box, Button, Card, Container, Typography } from '@mui/material';
import Link from 'next/link';

import { LocaleParamProps, TranslationNamespace } from '../lib/internationalization/definitions';
import initTranslations from '../lib/internationalization/i18n';

const Home = async ({ params }: LocaleParamProps) => {
  const { locale } = await params;

  const { t } = await initTranslations(locale, [TranslationNamespace.Common]);

  return (
    <Box className="bg-left min-h-screen logoBackground flex justify-end items-start">
      <Typography
        sx={{
          '@media (min-width: 400px) and (max-width: 700px)': {
            fontSize: '2rem',
          },
          '@media (min-width: 701px) and (max-width: 1365px)': {
            fontSize: '3rem',
          },

          '@media (min-width: 1366px) and (max-width: 1920px)': {
            fontSize: '4rem',
          },

          '@media (min-width: 1921px) and (max-width: 2560px)': {
            fontSize: '5rem',
          },

          '@media (min-width: 2560px)': {
            fontSize: '5.5rem',
          },
          textAlign: 'center',
          marginLeft: '2.1vw',
        }}
      >
        {t('home_header')}
      </Typography>
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
          sx={{
            '@media (min-width: 400px) and (max-width: 700px)': {
              width: '40vw',
              height: '60vh',
              marginTop: '7vh',
              marginRight: '4vw',
            },
            '@media (min-width: 700px) and (max-width: 1366px)': {
              width: '40vw',
              height: '65vh',
              marginTop: '7vh',
              marginRight: '4vw',
            },

            '@media (min-width: 1366px) and (max-width: 1920px)': {
              width: '35vw',
              height: '70vh',
              marginTop: '7vh',
              marginRight: '2vw',
            },

            '@media (min-width: 1920px) and (max-width: 2560px)': {
              width: '30vw',
              height: '60vh',
              marginTop: '7vh',
              marginRight: '2vw',
            },

            '@media (min-width: 2560px)': {
              width: '30vw',
              height: '80h',
              marginTop: '7vh',
              marginRight: '0.01vw',
            },
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 24,
            gap: '10vh',
          }}
        >
          <Typography
            sx={{
              '@media (min-width: 400px) and (max-width: 700px)': {
                fontSize: '1rem',
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
            Vivid-Panda
          </Typography>
          <Link href="/auth/login">
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: '12px',
                paddingX: '4vw',
                paddingY: '10vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                heigth: 'auto',
              }}
            >
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  '@media (min-width: 400px) and (max-width: 700px)': {
                    gap: '0.3rem',
                    fontSize: '1rem',
                  },
                  '@media (min-width: 700px) and (max-width: 1366px)': {
                    gap: '0.5rem',
                    fontSize: '1.2rem',
                  },

                  '@media (min-width: 1366px) and (max-width: 1920px)': {
                    gap: '1rem',
                    fontSize: '1.4rem',
                  },

                  '@media (min-width: 1920px) and (max-width: 2560px)': {
                    gap: '3rem',
                    fontSize: '1.6rem',
                  },

                  '@media (min-width: 2560px)': {
                    gap: '4rem',
                    fontSize: '1.8rem',
                  },
                }}
              >
                {t('welcome_header')}
              </Typography>
            </Button>
          </Link>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
