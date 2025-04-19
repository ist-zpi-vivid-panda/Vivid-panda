import { DetailedHTMLProps, HTMLAttributes } from 'react';

export type DropdownItemProps = {
  label: string;
  onSelect: () => void;
};

const DropdownItem = ({
  label,
  onSelect,
  ...restOfProps
}: DropdownItemProps & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <button {...restOfProps} onClick={onSelect} className="flex w-full py-2 px-4">
    {label}
  </button>
);

export default DropdownItem;
