import { toast } from 'react-toastify';

const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  }
};

export default handleApiError;
