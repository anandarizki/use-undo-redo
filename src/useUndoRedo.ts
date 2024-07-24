import { useEffect, useRef, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import last from "lodash.last";

type Options = {
  capacity?: number;
  debounce?: number;
};

type Output<T> = [
  () => void,
  () => void,
  {
    canUndo: boolean;
    canRedo: boolean;
    reset: () => void;
    history: StateHistory<T>[];
    jumpTo: (pointer: number) => void;
    pointer: number
  }
];

type StateHistory<T> = {
  value: T;
  timestamp: Date;
};

export function useUndoRedo<T>(
  primaryState: [T, (v: T) => void],
  { capacity = 10, debounce = 0 }: Options = {}
): Output<T> {
  const [state, setState] = primaryState;
  const [history, setHistory] = useState<StateHistory<T>[]>([]);
  const [pointer, setPointer] = useState(0);

  const allowUpdateHistory = useRef<boolean>(true);

  const updateHistory = (newState: T) => {
    const updatedHistory = [
      ...history.slice(0, pointer + 1),
      { value: newState, timestamp: new Date() },
    ];

    if (updatedHistory.length > capacity) {
      updatedHistory.shift();
    }

    setHistory(updatedHistory);
    setPointer(updatedHistory.length - 1);
  };

  const jumpTo = (index: number) => {
    allowUpdateHistory.current = false;
    setState(history[index].value);
    setPointer(index);
  };

  const undo = () => {
    if (canUndo) jumpTo(pointer - 1);
  };

  const redo = () => {
    if (canRedo) jumpTo(pointer + 1);
  };

  const reset = () => {
    setHistory([]);
    setPointer(0);
  };

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  useEffect(() => {
    const addHistoryEntry = () => {
      const lastEntry = last(history);
      if (allowUpdateHistory.current && !isEqual(state, lastEntry?.value)) {
        updateHistory(cloneDeep(state));
      }
      allowUpdateHistory.current = true;
    };

    if (debounce === 0) {
      addHistoryEntry();
    } else {
      const timeoutId = setTimeout(addHistoryEntry, debounce);
      return () => clearTimeout(timeoutId);
    }
  }, [state, debounce, history]);

  return [undo, redo, { canUndo, canRedo, reset, history, jumpTo, pointer }];
}
