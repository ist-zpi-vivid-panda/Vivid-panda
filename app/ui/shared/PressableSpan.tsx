import { Children } from '@/app/lib/definitions';

type PressableSpanProps = {
  children: Children;
  onClick: () => void;
};

const PressableSpan = ({ children, onClick }: PressableSpanProps) => (
  <span
    role="button"
    tabIndex={0}
    onKeyDown={() => {}}
    className="font-bold cursor-pointer pointer-events-auto" // enable pointer events because could be disabled for parent
    onClick={onClick}
  >
    {children}
  </span>
);

export default PressableSpan;
