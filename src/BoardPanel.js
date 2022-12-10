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

  const handleNewGame = () => {
    setStarted(true);
  };

  if (started) {
    return (
      <div className="game-board">
        <Board
          width={width}
          height={height}
          mines={mines}
          onGameEnd={(boardModel, win) => {
            console.log("game end");
            setStarted(false);
            if (win) unlockState.onWin(boardModel);
          }}
          automationConfig={unlockStateSnap.getUnlockedUpgrades()}
        />
      </div>
    );
  } else {
    return (
      <div className="game-info">
        <div>
          Width:{" "}
          <input
            type="number"
            name="Width"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          ></input>
        </div>
        <div>
          Height:{" "}
          <input
            type="number"
            name="Height"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          ></input>
        </div>
        <div>
          Mines:{" "}
          <input
            type="number"
            name="Mines"
            value={mines}
            onChange={(e) => setMines(parseInt(e.target.value))}
          ></input>
        </div>
        <button type="submit" onClick={handleNewGame}>
          New Game
        </button>
      </div>
    );
  }
}
