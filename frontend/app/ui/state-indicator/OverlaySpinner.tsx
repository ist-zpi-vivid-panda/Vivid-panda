import { Backdrop } from '@mui/material';

import Spinner from './Spinner';

type OverlaySpinnerProps = {
  open: boolean;
};

const OverlaySpinner = ({ open }: OverlaySpinnerProps) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
    open={open}
  >
    <Spinner />
  </Backdrop>
);

export default OverlaySpinner;
