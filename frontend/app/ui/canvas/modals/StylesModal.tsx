import { TransferStyle } from '@/app/lib/canvas/ai-functions/definitions';
import { getEnumValues } from '@/app/lib/utilities/enums';

import ActionModal from '../../utilities/ActionModal';

type StylesModalProps = {
  isOpen: boolean;
  close: () => void;
  setTransferStyle: (_: TransferStyle) => void;
};

const styles = getEnumValues(TransferStyle);

const StylesModal = ({ isOpen, close, setTransferStyle }: StylesModalProps) => {
  return (
    <ActionModal isOpen={isOpen} close={close}>
      <div className="text-large-edit">
        <div className="text-large-edit-less">
          {styles.map((style) => (
            <button key={style} onClick={() => setTransferStyle(style)}>
              {style}
            </button>
          ))}
        </div>
      </div>
    </ActionModal>
  );
};

export default StylesModal;
