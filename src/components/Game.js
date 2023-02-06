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
      <AutomationUnlockPanel
        gameState={props.gameState}
        resetSave={props.resetSave}
      />
      <div className="boards">
        <BoardPanel
          boardSlot={props.gameState.boardSlots[0]}
          gameState={props.gameState}
          unlockState={unlockState}
        />
        {unlockStateSnap.isUnlocked("multiBoard1") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[1]}
            gameState={props.gameState}
            unlockState={unlockState}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard2") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[2]}
            gameState={props.gameState}
            unlockState={unlockState}
          />
        )}
        {unlockStateSnap.isUnlocked("multiBoard3") && (
          <BoardPanel
            boardSlot={props.gameState.boardSlots[3]}
            gameState={props.gameState}
            unlockState={unlockState}
          />
        )}
      </div>
    </div>
  );
}
