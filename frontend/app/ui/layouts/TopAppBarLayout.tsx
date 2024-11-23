import { ChildrenProp } from '@/app/lib/definitions';
import { Box } from '@mui/material';

import TopAppBar from '../navigation/TopAppBar';

const TopAppBarLayout = ({ children }: ChildrenProp) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Box component="nav">
      <TopAppBar />
    </Box>

    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
      }}
    >
      {children}
    </Box>
  </Box>
);

export default TopAppBarLayout;
