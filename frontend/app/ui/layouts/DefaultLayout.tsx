import { ChildrenProp } from '@/app/lib/definitions';
import { Box } from '@mui/material';

const FullScreenLayout = ({ children }: ChildrenProp) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flex: 1,
      overflowY: 'auto',
    }}
  >
    {children}
  </Box>
);

export default FullScreenLayout;
