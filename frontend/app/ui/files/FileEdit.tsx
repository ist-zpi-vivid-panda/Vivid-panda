import { useCallback, useEffect } from 'react';

import { FileInfo, FileInfoEditDTO, useUpdateFileMutation } from '@/app/lib/api/fileApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { SchemaNames } from '@/app/lib/validation/config';
import { Card, Modal } from '@mui/material';
import { FieldValues } from 'react-hook-form';

import ControlledCustomInput from '../shared/CustomInput';
import SubmitButton from '../shared/SubmitButton';

type FileEditProps = {
  fileInfo?: FileInfo;
  onClose: () => void;
};

const FileEdit = ({ fileInfo, onClose }: FileEditProps) => {
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
    <Modal
      open={!!fileInfo}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-auto items-center justify-center mb-32"
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlledCustomInput control={control} name="filename" errors={errors} label="File name" />

          <div className="flex justify-end mb-20">
            <SubmitButton />
          </div>
        </form>
      </Card>
    </Modal>
  );
};

export default FileEdit;
