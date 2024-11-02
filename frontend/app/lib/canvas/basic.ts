import { MouseInfo } from './definitions';

type MouseInfoSetterProps = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  parent: HTMLDivElement | null;
  setMouseInfo: (_: MouseInfo) => void;
};

export const mouseInfoCalc = ({ event, parent, setMouseInfo }: MouseInfoSetterProps) => {
  if (!parent) {
    return;
  }

  const bounds = parent.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const deltaX = x - parent.clientWidth / 2;
  const deltaY = y - parent.clientHeight / 2;
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  setMouseInfo({ x, y, angle });
};
