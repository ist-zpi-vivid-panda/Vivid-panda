'use client';

import { useEffect, useState } from 'react';

import { ChildrenProp } from '../../lib/definitions';

const HydrationZustand = ({ children }: ChildrenProp) => {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? <>{children}</> : null;
};

export default HydrationZustand;
