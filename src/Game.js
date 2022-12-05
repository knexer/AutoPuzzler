import React, { useRef, useState } from "react";
import { proxy, useSnapshot } from "valtio";

import Board from "./Board.js";
import AutomationUnlockPanel from "./AutomationUnlockPanel";
import UnlockState from "./UnlockState";

const useUnlockState = () => {
  const unlockStateRef = useRef(null);
  if (unlockStateRef.current === null) {
    unlockStateRef.current = proxy(new UnlockState());
  }

  return {
    unlockState: unlockStateRef.current,
    unlockStateSnap: useSnapshot(unlockStateRef.current),
  };
};

export default function Game(props) {
  const [nextMines, setNextMines] = useState(3);
  const [nextWidth, setNextWidth] = useState(4);
  const [nextHeight, setNextHeight] = useState(6);

  const [mines, setMines] = useState(nextMines);
  const [width, setWidth] = useState(nextWidth);
  const [height, setHeight] = useState(nextHeight);
  const [gameId, setGameId] = useState(0);

  const { unlockState, unlockStateSnap } = useUnlockState();

  const handleNewGame = () => {
    setMines(nextMines);
    setWidth(nextWidth);
    setHeight(nextHeight);
    setGameId(gameId + 1);
  };

  return (
    <div className="game">
      <div className="left-panel">
        <div className="game-board">
          <Board
            width={width}
            height={height}
            mines={mines}
            automationConfig={unlockStateSnap.makeAutomationConfig()}
            key={gameId}
          />
        </div>
        <div className="game-info">
          <div>
            Width:{" "}
            <input
              type="number"
              name="Width"
              value={nextWidth}
              onChange={(e) => setNextWidth(parseInt(e.target.value))}
            ></input>
          </div>
          <div>
            Height:{" "}
            <input
              type="number"
              name="Height"
              value={nextHeight}
              onChange={(e) => setNextHeight(parseInt(e.target.value))}
            ></input>
          </div>
          <div>
            Mines:{" "}
            <input
              type="number"
              name="Mines"
              value={nextMines}
              onChange={(e) => setNextMines(parseInt(e.target.value))}
            ></input>
          </div>
          <button type="submit" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </div>
      <AutomationUnlockPanel unlockState={unlockState} />
    </div>
  );
}
