import React, { useRef } from "react";
import { proxy, useSnapshot } from "valtio";

import BoardPanel from "./BoardPanel.js";
import AutomationUnlockPanel from "./AutomationUnlockPanel";
import UnlockState from "./UnlockState";

const useUnlockState = () => {
  const unlockStateRef = useRef(null);
  if (unlockStateRef.current === null) {
    unlockStateRef.current = proxy(new UnlockState());
  }

  return unlockStateRef.current;
};

export default function Game(props) {
  const unlockState = useUnlockState();
  const unlockStateSnap = useSnapshot(unlockState);

  return (
    <div className="game">
      <AutomationUnlockPanel unlockState={unlockState} />
      <div className="boards">
        <BoardPanel unlockState={unlockState} />
        {unlockStateSnap.isUnlocked("multiBoard1") && (
          <BoardPanel unlockState={unlockState} />
        )}
        {unlockStateSnap.isUnlocked("multiBoard2") && (
          <BoardPanel unlockState={unlockState} />
        )}
        {unlockStateSnap.isUnlocked("multiBoard3") && (
          <BoardPanel unlockState={unlockState} />
        )}
      </div>
    </div>
  );
}
