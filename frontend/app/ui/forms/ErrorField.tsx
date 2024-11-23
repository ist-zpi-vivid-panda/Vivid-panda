import { Box, Typography } from '@mui/material';

type ErrorFieldProps = {
  error?: string;
};

const ErrorField = ({ error }: ErrorFieldProps) =>
  error ? (
    <Box
      sx={{
        backgroundColor: 'error.main',
        borderRadius: 1,
        padding: 1,
        wordWrap: 'break-word',
        maxWidth: 0,
        minWidth: '100%',
      }}
    >
      <Typography variant="caption">{error}</Typography>
    </Box>
  ) : (
    false
  );

export default ErrorField;
