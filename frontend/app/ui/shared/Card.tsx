import { ChildrenProp } from '@/app/lib/definitions';

export const cardClassName = 'flex flex-1 flex-col rounded-xl primaryBackground ';

const Card = ({ children, className = '' }: ChildrenProp & { className?: string }) => (
  <div className={cardClassName + className}>{children}</div>
);

export default Card;
