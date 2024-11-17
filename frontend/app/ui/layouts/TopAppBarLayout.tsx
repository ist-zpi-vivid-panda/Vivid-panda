import { ChildrenProp } from '@/app/lib/definitions';

import TopAppBar from '../navigation/TopAppBar';

const TopAppBarLayout = ({ children }: ChildrenProp) => (
  <div className="min-h-screen flex flex-col">
    <nav>
      <TopAppBar />
    </nav>

    {children}
  </div>
);

export default TopAppBarLayout;
