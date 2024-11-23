import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2vw', // Adjust based on viewport width
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.5vw',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2vw',
  },
}));

export default ResponsiveTypography;
