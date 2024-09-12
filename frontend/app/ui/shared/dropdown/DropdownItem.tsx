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
  <button {...restOfProps} onClick={onSelect}>
    {label}
  </button>
);

export default DropdownItem;
