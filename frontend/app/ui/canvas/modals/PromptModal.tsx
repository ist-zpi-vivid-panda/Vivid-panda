import { useCallback } from 'react';

import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Box } from '@mui/material';
import { FieldValues } from 'react-hook-form';

import ControlledCustomInput from '../../forms/CustomInput';
import SubmitButton from '../../forms/SubmitButton';
import ActionModal from '../../utilities/ActionModal';

type PromptModalProps = {
  isOpen: boolean;
  close: () => void;
  setPromptText: (_: string) => void;
};

const PromptModal = ({ isOpen, close, setPromptText }: PromptModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useConfiguredForm({});

  const { t } = useStrings(TranslationNamespace.Canvas);

  const onSubmit = useCallback(
    async (values: FieldValues) => {
      setPromptText(values.prompt);
      reset();
    },
    [reset, setPromptText]
  );

  return (
    <ActionModal isOpen={isOpen} close={close}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledCustomInput control={control} errors={errors} label={t('prompt')} name="prompt" required />

        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <SubmitButton />
        </Box>
      </form>
    </ActionModal>
  );
};

export default PromptModal;
