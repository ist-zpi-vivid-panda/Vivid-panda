import { Children } from '@/app/lib/definitions';
import { Card, Modal } from '@mui/material';

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
      <Card>{children}</Card>
    </Modal>
  );
};

export default ActionModal;
