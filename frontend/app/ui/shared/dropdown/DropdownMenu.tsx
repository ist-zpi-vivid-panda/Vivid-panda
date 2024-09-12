import { useCallback, useState } from 'react';

import { FaChevronDown } from 'react-icons/fa6';

import { DropdownItemProps } from './DropdownItem';
import DropdownList from './DropdownList';
import PressableSpan from '../PressableSpan';

type DropdownProps = { options: DropdownItemProps[]; text: string };

const DropdownMenu = ({ options, text }: DropdownProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  return (
    <button className="flex flex-row flex-wrap items-center gap-1">
      <FaChevronDown onClick={toggleOpen} className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />

      <DropdownList options={options} isOpen={isOpen} />

      <PressableSpan onClick={toggleOpen}>{text}</PressableSpan>
    </button>
  );
};

export default DropdownMenu;
