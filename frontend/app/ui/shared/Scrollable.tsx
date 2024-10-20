import { UIEventHandler } from 'react';

import { Children } from '@/app/lib/definitions';

type ScrollableProps = {
  children: Children;
  onScroll: UIEventHandler<HTMLDivElement>;
};

const Scrollable = ({ children, onScroll }: ScrollableProps) => (
  <div onScroll={onScroll} className="overflow-y-visible">
    {children}
  </div>
);

export default Scrollable;
