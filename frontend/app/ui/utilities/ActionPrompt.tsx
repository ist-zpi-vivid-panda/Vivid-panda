'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ChildrenProp } from '@/app/lib/definitions';
import { Card, Modal } from '@mui/material';

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

const PromptAction = ({ text, onPress }: PromptActionProps) => <button onClick={onPress}>{text}</button>;

const ActionPromptContext = createContext<ActionPromptProps>({ prompt: () => {} });

export const ActionPrompt = ({ children }: ChildrenProp) => {
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
              text: 'Cancel',
              isCancelStyled: true,
            },
            ...actions,
          ]
        : actions,
    [actions, cancelable]
  );

  return (
    <ActionPromptContext.Provider value={{ prompt }}>
      <Modal
        open={isVisible}
        onClose={hideOverlay}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex flex-auto items-center justify-center mb-32"
      >
        <Card>
          <div style={{ backgroundColor: 'lavender' }}>
            {title}

            {message}
          </div>

          {(!actionsWithAdditional || actionsWithAdditional.length === 0) && (
            <div>
              <PromptAction text="Ok" onPress={hideOverlay} />
            </div>
          )}

          {actionsWithAdditional && actionsWithAdditional.length > 0 && (
            <div style={{ backgroundColor: 'lavender' }}>
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
            </div>
          )}
        </Card>
      </Modal>

      {children}
    </ActionPromptContext.Provider>
  );
};

const useActionPrompt = () => useContext(ActionPromptContext);

export default useActionPrompt;
