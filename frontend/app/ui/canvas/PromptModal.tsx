import { useCallback } from 'react';

import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { FieldValues } from 'react-hook-form';

import ControlledCustomInput from '../shared/CustomInput';
import SubmitButton from '../shared/SubmitButton';
import ActionModal from '../utilities/ActionModal';

type PromptModalProps = {
  isOpen: boolean;
  close: () => void;
  setPromptText: (_: string) => void;
};

const PromptModal = ({ isOpen, close, setPromptText }: PromptModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useConfiguredForm({});

  const { t } = useStrings(TranslationNamespace.Canvas);

  const onSubmit = useCallback(
    async (values: FieldValues) => {
      const prompt: string = values.prompt;

      setPromptText(prompt);
    },
    [setPromptText]
  );

  return (
    <ActionModal isOpen={isOpen} close={close}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledCustomInput
          control={control}
          errors={errors}
          label={t('email')}
          type="email"
          name="email"
          required
        />

        <div className="flex justify-end mb-20">
          <SubmitButton />
        </div>
      </form>
    </ActionModal>
  );
};

export default PromptModal;
