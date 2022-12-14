import React, { useState } from "react";
import { useSnapshot } from "valtio";

import Board from "./Board.js";

export default function BoardPanel(props) {
  const unlockState = props.unlockState;
  const unlockStateSnap = useSnapshot(unlockState);
  const boardSlot = props.boardSlot;
  const boardSlotSnap = useSnapshot(props.boardSlot);

  if (boardSlotSnap.boardModel !== null) {
    return (
      <Board
        model={boardSlot.boardModel}
        onGameEnd={boardSlot.completeGame}
        automationConfig={unlockStateSnap.getUnlockedUpgrades()}
      />
    );
  } else {
    const renderNewGameButton = (startGame, text) => {
      return (
        <button type="button" onClick={startGame}>
          {text}
        </button>
      );
    };
    return (
      <div className="board-container">
        {renderNewGameButton(boardSlot.startSmallGame, "New Smol Board")}
        {unlockStateSnap.isUnlocked("boardMedium")
          ? renderNewGameButton(boardSlot.startMediumGame, "New Medium Board")
          : ""}
        {unlockStateSnap.isUnlocked("boardLarge")
          ? renderNewGameButton(boardSlot.startLargeGame, "New Big Board")
          : ""}
      </div>
    );
  }
}
