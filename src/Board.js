import React, { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import BoardPlayer from "./BoardPlayer.js";
import Square from "./Square.js";

// TODO:
// move the useBoardPlayer stuff to model side as well.
// Yay! This will do very little, and p much only view side stuff, after this

const useBoardPlayer = (props, model, reverse) => {
  const boardPlayerRef = useRef(null);
  if (
    boardPlayerRef.current === null &&
    (!reverse || props.automationConfig.twoWorkers)
  ) {
    boardPlayerRef.current = new BoardPlayer(
      model,
      props.automationConfig,
      reverse
    );
  }

  useEffect(() => {
    if (!boardPlayerRef.current) return;
    boardPlayerRef.current.startInterval();

    return () => boardPlayerRef.current.stopInterval();
  }, [props.automationConfig.twoWorkers]);

  if (boardPlayerRef.current) {
    boardPlayerRef.current.setAutomationConfig(props.automationConfig);
  }

  return boardPlayerRef.current;
};

export default function Board(props) {
  const model = props.model;
  const modelSnap = useSnapshot(model);
  const width = modelSnap.width;
  const height = modelSnap.height;

  const boardPlayer = useBoardPlayer(props, model, false);
  // Create a second BoardPlayer for the reverse-direction automation worker.
  useBoardPlayer(props, model, true);

  const gameWin = modelSnap.isWon;
  const gameLose = modelSnap.isLost;

  const status = () => {
    if (gameLose)
      return (
        <div className="status">
          <div>Mine found the hard way - you lose!</div>
          <button type="button" onClick={() => props.onGameEnd(model, false)}>
            Abandon Game
          </button>
        </div>
      );
    if (gameWin)
      return (
        <div className="status">
          <div>All mines found - you win!</div>
          <button type="button" onClick={() => props.onGameEnd(model, true)}>
            Claim Spoils - ${model.mines}
          </button>
        </div>
      );
    return (
      <div className="status">
        {/* eslint-disable-next-line valtio/state-snapshot-rule */}
        Flagged {modelSnap.numFlaggedSquares} of {model.mines} mines.
      </div>
    );
  };

  const renderSquare = (x, y) => {
    return (
      <Square
        key={y * width + x}
        onClick={() => boardPlayer.handleClick({ x, y })}
        onFlag={(flagged) => boardPlayer.handleFlag({ x, y }, flagged)}
        gameWin={gameWin}
        gameLose={gameLose}
        model={model.squareAt({ x: x, y: y })}
      />
    );
  };

  const renderRow = (y) => {
    return (
      <div className="board-row" key={y}>
        {Array.from({ length: width }, (_, i) => renderSquare(i, y))}
      </div>
    );
  };

  return (
    <div>
      <div className="board-container">
        <div>{Array.from({ length: height }, (_, i) => renderRow(i))}</div>
        {status()}
      </div>
    </div>
  );
}
