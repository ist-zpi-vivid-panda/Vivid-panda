import { FaCheck, FaX } from 'react-icons/fa6';

type WandTrayProps = {
  clearMask: () => void;
  acceptMask: () => void;
};

const WandTray = ({ clearMask, acceptMask }: WandTrayProps) => {
  return (
    <div>
      <button onClick={clearMask}>{<FaX />}</button>

      <button onClick={acceptMask}>{<FaCheck />}</button>
    </div>
  );
};

export default WandTray;
