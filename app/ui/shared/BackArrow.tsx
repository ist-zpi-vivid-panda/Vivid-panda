import { FaArrowLeftLong } from 'react-icons/fa6';

type BackArrowProps = {
  onBack?: () => void;
  size?: number;
};

const BackArrow = ({ onBack, size }: BackArrowProps) => (
  <FaArrowLeftLong className="cursor-pointer" size={size} onClick={onBack} />
);

export default BackArrow;
