import React from "react";
import { useSnapshot } from "valtio";
import { Button, Paper, Typography } from "@mui/material/";

import Square from "./Square.js";

export default function Board(props) {
  const model = props.model;
  const modelSnap = useSnapshot(model);
  const width = modelSnap.width;
  const height = modelSnap.height;

  const gameWin = modelSnap.isWon;
  const gameLose = modelSnap.isLost;
  const numFlaggedSquares = modelSnap.numFlaggedSquares;

  const status = () => {
    if (gameLose)
      return (
        <div className="status">
          <Button
            variant="contained"
            onClick={() => props.onGameEnd(model, false)}
          >
            Abandon Game
          </Button>
        </div>
      );
    if (gameWin)
      return (
        <div className="status">
          <Button
            variant="contained"
            onClick={() => props.onGameEnd(model, true)}
          >
            Claim Spoils - ${model.mines}
          </Button>
        </div>
      );
    return (
      <div className="status">
        <Paper elevation={1}>
          <Typography className="mine-counter">
            {"🚩".repeat(numFlaggedSquares) +
              "💣".repeat(model.mines - numFlaggedSquares)}
          </Typography>
        </Paper>
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
      <div>{Array.from({ length: height }, (_, i) => renderRow(i))}</div>
      {status()}
    </div>
  );
}
