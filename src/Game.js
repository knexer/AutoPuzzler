import React from "react";
import { useSnapshot } from "valtio";

import BoardPanel from "./BoardPanel.js";
import AutomationUnlockPanel from "./AutomationUnlockPanel";

export default function Game(props) {
  const gameStateSnap = useSnapshot(props.gameState);
  const unlockState = props.gameState.unlocks;
  const unlockStateSnap = gameStateSnap.unlocks;

  return (
    <div className="game">
      <AutomationUnlockPanel gameState={props.gameState} />
      <div className="boards">
        <BoardPanel
          unlockState={unlockState}
          onWin={(boardModel) => props.gameState.onWin(boardModel)}
        />
        {unlockStateSnap.isUnlocked("multiBoard1") && (
          <BoardPanel
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard2") && (
          <BoardPanel
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard3") && (
          <BoardPanel
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
      </div>
    </div>
  );
}
