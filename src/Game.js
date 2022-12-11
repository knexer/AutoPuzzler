import React, { useRef } from "react";
import { proxy } from "valtio";

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

  return (
    <div className="game">
      <AutomationUnlockPanel unlockState={unlockState} />
      <BoardPanel unlockState={unlockState} />
    </div>
  );
}
