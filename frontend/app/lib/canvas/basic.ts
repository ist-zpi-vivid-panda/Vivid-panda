import { ReactCropperElement } from 'react-cropper';

import { MouseInfo } from './types';

type MouseInfoSetterProps = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  cropper: ReactCropperElement | null;
  setMouseInfo: (_: MouseInfo) => void;
};

export const mouseInfoCalc = ({ event, cropper, setMouseInfo }: MouseInfoSetterProps) => {
  if (!cropper) {
    return;
  }

  const bounds = cropper.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const deltaX = x - cropper.width / 2;
  const deltaY = y - cropper.height / 2;
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  setMouseInfo({ x, y, angle });
};
