import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { Children } from '@/app/lib/definitions';

type PressableSpanProps = {
  children: Children;
  onClick: () => void;
};

const PressableSpan = ({
  children,
  onClick,
  ...restOfProps
}: PressableSpanProps & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
  <span
    {...restOfProps}
    role="button"
    tabIndex={0}
    onKeyDown={() => {}}
    className="cursor-pointer pointer-events-auto" // enable pointer events because could be disabled for parent
    onClick={onClick}
  >
    {children}
  </span>
);

export default PressableSpan;
