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
          boardSlot={props.gameState.boardSlots[0]}
          unlockState={unlockState}
          onWin={(boardModel) => props.gameState.onWin(boardModel)}
        />
        {unlockStateSnap.isUnlocked("multiBoard1") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[1]}
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard2") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[2]}
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard3") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[3]}
            unlockState={unlockState}
            onWin={(boardModel) => props.gameState.onWin(boardModel)}
          />
        )}
      </div>
    </div>
  );
}
