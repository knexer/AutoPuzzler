import React, { useState } from "react";
import { useSnapshot } from "valtio";

import Board from "./Board.js";

export default function BoardPanel(props) {
  const unlockState = props.unlockState;
  const unlockStateSnap = useSnapshot(unlockState);

  const [started, setStarted] = useState(false);
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(8);
  const [mines, setMines] = useState(3);

  const handleNewGame = (width, height, mines) => {
    setStarted(true);
    setWidth(width);
    setHeight(height);
    setMines(mines);
  };

  if (started) {
    return (
      <Board
        width={width}
        height={height}
        mines={mines}
        onGameEnd={(boardModel, win) => {
          console.log("game end");
          setStarted(false);
          if (win) props.onWin(boardModel);
        }}
        automationConfig={unlockStateSnap.getUnlockedUpgrades()}
      />
    );
  } else {
    const renderNewGameButton = (width, height, mines, text) => {
      return (
        <button
          type="button"
          onClick={() => handleNewGame(width, height, mines)}
        >
          {text}
        </button>
      );
    };
    return (
      <div className="board-container">
        {renderNewGameButton(4, 4, 3, "New Smol Board")}
        {unlockStateSnap.isUnlocked("boardMedium")
          ? renderNewGameButton(6, 6, 6, "New Medium Board")
          : ""}
        {unlockStateSnap.isUnlocked("boardLarge")
          ? renderNewGameButton(9, 9, 13, "New Big Board")
          : ""}
      </div>
    );
  }
}
