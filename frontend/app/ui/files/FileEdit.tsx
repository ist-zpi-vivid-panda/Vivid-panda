import { useCallback, useEffect } from 'react';

import { useUpdateFileMutation } from '@/app/lib/api/fileApi';
import { FileInfo, FileInfoEditDTO } from '@/app/lib/files/definitions';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { SchemaNames } from '@/app/lib/validation/config';
import { Box } from '@mui/material';
import { FieldValues } from 'react-hook-form';

import ControlledCustomInput from '../forms/CustomInput';
import SubmitButton from '../forms/SubmitButton';
import ActionModal from '../utilities/ActionModal';

type FileEditProps = {
  fileInfo?: FileInfo;
  onClose: () => void;
};

const FileEdit = ({ fileInfo, onClose }: FileEditProps) => {
  const { t } = useStrings(TranslationNamespace.FILES);
  const updateFile = useUpdateFileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useConfiguredForm({ schemaName: SchemaNames.FileInfoEditSchema });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      if (!fileInfo) {
        return;
      }

      const edited: FileInfoEditDTO = {
        filename: values.filename,
      };

      updateFile.mutateAsync({ id: fileInfo.id, data: edited });

      onClose();
    },
    [fileInfo, updateFile, onClose]
  );

  useEffect(() => {
    if (!fileInfo) {
      return;
    }

    reset(fileInfo);
  }, [fileInfo, reset]);

  return (
    <ActionModal isOpen={!!fileInfo} close={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledCustomInput control={control} name="filename" errors={errors} label={t('file_name')} />

        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <SubmitButton />
        </Box>
      </form>
    </ActionModal>
  );
};

export default FileEdit;
