import { useCallback, useEffect, useMemo, useState } from 'react';

const STARTING_IDX: number = 0 as const;

const useChangeHistory = <T>(historyLength: number, startingValue: T) => {
  const [current, setCurrState] = useState<T>(startingValue);
  const [currIdx, setCurrIdx] = useState<number>(STARTING_IDX);

  const [stateHistory, setStateHistory] = useState<T[]>([startingValue]);

  const setCurrent = useCallback(
    (newState: T) => {
      setCurrIdx(STARTING_IDX);

      setStateHistory((arr) => [newState, ...arr.slice(currIdx, currIdx + 1 + historyLength)]);
    },
    [currIdx, historyLength]
  );

  const canUndo = useMemo(() => currIdx < stateHistory.length - 1, [currIdx, stateHistory.length]);

  const canRedo = useMemo(() => currIdx > 0, [currIdx]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrIdx((prev) => prev + 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrIdx((prev) => prev - 1);
    }
  }, [canRedo]);

  useEffect(() => setCurrState(stateHistory[currIdx]), [currIdx, stateHistory]);

  return { current, setCurrent, undo, redo, canUndo, canRedo };
};

export default useChangeHistory;
