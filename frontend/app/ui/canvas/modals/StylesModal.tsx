import { TransferStyle } from '@/app/lib/canvas/ai-functions/definitions';
import { getEnumValues } from '@/app/lib/utilities/enums';
import { Button } from '@mui/material';

import ResponsiveTypography from '../../themed/ResponsiveTypography';
import ActionModal from '../../utilities/ActionModal';

type StylesModalProps = {
  isOpen: boolean;
  close: () => void;
  setTransferStyle: (_: TransferStyle) => void;
};

const styleTypes = getEnumValues(TransferStyle);

const StylesModal = ({ isOpen, close, setTransferStyle }: StylesModalProps) => {
  return (
    <ActionModal isOpen={isOpen} close={close}>
      {styleTypes.map((styleName) => (
        <Button variant="contained" key={styleName} onClick={() => setTransferStyle(styleName)}>
          <ResponsiveTypography>{styleName}</ResponsiveTypography>
        </Button>
      ))}
    </ActionModal>
  );
};

export default StylesModal;
