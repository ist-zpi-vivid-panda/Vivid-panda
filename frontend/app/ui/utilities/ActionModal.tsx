import { Children } from '@/app/lib/definitions';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Card, IconButton, Modal } from '@mui/material';

type ActionModalProps = {
  isOpen: boolean;
  close: () => void;
  children?: Children;
};

const ActionModal = ({ isOpen, close, children }: ActionModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-auto items-center justify-center mb-32"
    >
      <Card sx={{ display: 'flex', flexDirection: 'column', p: 3, pt: 8, position: 'relative' }}>
        <IconButton
          onClick={close}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          color="inherit"
        >
          <CloseRoundedIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
      </Card>
    </Modal>
  );
};

export default ActionModal;
