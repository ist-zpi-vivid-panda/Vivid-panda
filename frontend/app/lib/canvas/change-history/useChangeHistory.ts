import { useCallback, useEffect, useMemo, useState } from 'react';

const useChangeHistory = <T>(historyLength: number, startingValue: T) => {
  const [current, setCurrState] = useState<T>(startingValue);
  const [currIdx, setCurrIdx] = useState<number>(0);

  const [stateHistory, setStateHistory] = useState<T[]>([startingValue]);

  const setCurrent = useCallback(
    (newState: T) => setStateHistory((arr) => [newState, ...arr.slice(currIdx, currIdx + 1 + historyLength)]),
    [currIdx, historyLength]
  );

  const canUndo = useMemo(() => currIdx < stateHistory.length, [currIdx, stateHistory.length]);

  const canRedo = useMemo(() => currIdx < 1, [currIdx]);

  const undo = useCallback(() => {
    console.log('undo');
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

  useEffect(() => {
    console.log('IDX:', currIdx, 'SIZE:', stateHistory.length);
  }, [currIdx, stateHistory]);

  return { current, setCurrent, undo, redo, canUndo, canRedo };
};

export default useChangeHistory;
