'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ChildrenProp } from '@/app/lib/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Box, Button } from '@mui/material';

import ActionModal from './ActionModal';
import ResponsiveTypography from '../themed/ResponsiveTypography';

type PromptActionProps = {
  text: string;
  isCancelStyled?: boolean;
  onPress?: () => void;
};

type PromptProps = {
  title?: string;
  message?: string;
  actions?: PromptActionProps[];
  cancelable?: boolean;
};

type ActionPromptProps = {
  prompt: (_: PromptProps) => void;
};

const PromptAction = ({ text, onPress }: PromptActionProps) => (
  <Button variant="contained" sx={{ flex: 1 }} onClick={onPress}>
    {text}
  </Button>
);

const ActionPromptContext = createContext<ActionPromptProps>({ prompt: () => {} });

export const ActionPrompt = ({ children }: ChildrenProp) => {
  const { t } = useStrings(TranslationNamespace.Common);

  const [overlayState, setOverlayState] = useState<PromptProps>({});
  const [isVisible, setVisible] = useState<boolean>(false);

  const { title, message, cancelable } = overlayState;

  const actions = useMemo(() => overlayState.actions ?? [], [overlayState.actions]);

  const hideOverlay = useCallback(() => setVisible(false), []);
  const showOverlay = useCallback(() => setVisible(true), []);

  const prompt = useCallback(
    (props: PromptProps) => {
      setOverlayState(props);
      showOverlay();
    },
    [showOverlay]
  );

  const hideOverlayWithFn = useCallback(
    (fn: () => void) => {
      if (fn) {
        fn();
      }

      hideOverlay();
    },
    [hideOverlay]
  );

  const actionsWithAdditional: PromptActionProps[] = useMemo(
    () =>
      cancelable
        ? [
            {
              text: t('cancel'),
              isCancelStyled: true,
            },
            ...actions,
          ]
        : actions,
    [actions, cancelable, t]
  );

  return (
    <ActionPromptContext.Provider value={{ prompt }}>
      <ActionModal isOpen={isVisible} close={hideOverlay}>
        <Box>
          <ResponsiveTypography>{title}</ResponsiveTypography>

          <ResponsiveTypography>{message}</ResponsiveTypography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {(!actionsWithAdditional || actionsWithAdditional.length === 0) && (
            <PromptAction text={t('ok')} onPress={hideOverlay} />
          )}

          {actionsWithAdditional && actionsWithAdditional.length > 0 && (
            <>
              {actionsWithAdditional?.map((action, index) => (
                <PromptAction
                  key={index}
                  text={action?.text}
                  isCancelStyled={action?.isCancelStyled}
                  onPress={() =>
                    hideOverlayWithFn(() => {
                      if (action?.onPress) {
                        action?.onPress();
                      }
                    })
                  }
                />
              ))}
            </>
          )}
        </Box>
      </ActionModal>

      {children}
    </ActionPromptContext.Provider>
  );
};

const useActionPrompt = () => useContext(ActionPromptContext);

export default useActionPrompt;
