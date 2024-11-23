import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from '@mui/material';

type WandTrayProps = {
  clearMask: () => void;
  acceptMask: () => void;
};

const WandTray = ({ clearMask, acceptMask }: WandTrayProps) => {
  return (
    <>
      <Button variant="contained" onClick={clearMask}>
        {<CloseRoundedIcon />}
      </Button>

      <Button variant="contained" onClick={acceptMask}>
        {<CheckRoundedIcon />}
      </Button>
    </>
  );
};

export default WandTray;
