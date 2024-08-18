// global types here!

import { ReactNode } from 'react';

export type ChildrenProp = {
  children: Children;
};

export type Children = ReactNode | ReactNode[];

export type TMap<T> = { [key: string]: T };

export type StringMap = TMap<string>;
