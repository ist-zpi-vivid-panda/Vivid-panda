import { ChildrenProp } from '@/app/lib/definitions';
import { Card } from '@mui/material';

const TrayCard = ({ children }: ChildrenProp) => (
  <Card
    sx={{
      padding: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      overflowY: 'auto',
      maxHeight: '70vh',
    }}
  >
    {children}
  </Card>
);

export default TrayCard;
