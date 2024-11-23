import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { IconButton } from '@mui/material';

type BackArrowProps = {
  onBack?: () => void;
};

const BackArrow = ({ onBack }: BackArrowProps) => (
  <IconButton color="inherit" onClick={onBack}>
    <ArrowBackRoundedIcon fontSize="large" />
  </IconButton>
);

export default BackArrow;
