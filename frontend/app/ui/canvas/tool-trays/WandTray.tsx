import { FaCheck, FaX } from 'react-icons/fa6';

type WandTrayProps = {
  clearMask: () => void;
  acceptMask: () => void;
};

const WandTray = ({ clearMask, acceptMask }: WandTrayProps) => {
  return (
    <div className="text-large-edit">
      <div className="text-large-edit-less">
        <button onClick={clearMask}>{<FaX />}</button>

        <button onClick={acceptMask}>{<FaCheck />}</button>
      </div>
    </div>
  );
};

export default WandTray;
