'use client';

import DropdownItem, { DropdownItemProps } from './DropdownItem';

type DropdownListProps = {
  options: DropdownItemProps[];
  isOpen: boolean;
};

const DropdownList = ({ options, isOpen }: DropdownListProps) => {
  return (
    <div className="relative inline-block text-left">
      <div
        className={`primaryBackground origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all transform ${
          isOpen
            ? 'opacity-100 scale-100 duration-200 ease-out'
            : 'opacity-0 scale-95 pointer-events-none duration-150 ease-in'
        }`}
      >
        <div className="py-3 px-4" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {options.map(({ ...props }, index) => (
            <DropdownItem {...props} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownList;
