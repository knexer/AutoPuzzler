import React from "react";
import { useSnapshot } from "valtio";
import Square from "./Square.js";

export default function Board(props) {
  const model = props.model;
  const modelSnap = useSnapshot(model);
  const width = modelSnap.width;
  const height = modelSnap.height;

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
        onClick={() => props.player.handleClick({ x, y })}
        onFlag={(flagged) => props.player.handleFlag({ x, y }, flagged)}
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
