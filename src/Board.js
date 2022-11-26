import React, { useEffect, useRef } from "react";
import { proxy, useSnapshot } from "valtio";
import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
import Square from "./Square.js";

const handleInterval = (props, model) => {
  // let's simulate a left and right click on every revealed square.
  for (const { square, loc } of model.allSquares()) {
    if (square.revealed) {
      if (props.autoClick) handleClick(props, model, loc);
      if (props.autoRightClick) handleFlag(props, model, loc);
    }
  }
};

const handleClick = (props, model, loc) => {
  const square = model.squareAt(loc);
  if (square.flagged) {
    return;
  }

  if (square.revealed) {
    if (props.safeAutoReveal >= square.adjacentMines) {
      model.safeRevealAdjacentSquares(loc);
    } else if (props.autoReveal >= square.adjacentMines) {
      model.revealAdjacentSquares(loc);
    }
  }

  square.revealed = true;
};

const handleFlag = (props, model, loc, flagged) => {
  if (model.squareAt(loc).revealed) {
    if (props.safeAutoFlag) {
      model.safeFlagAdjacentSquares(loc);
    } else if (props.autoFlag) {
      model.flagAdjacentSquares(loc);
    }
  } else {
    model.squareAt(loc).flagged = flagged;
  }
};

const initModel = (props) => {
  const model = proxy(new BoardModel(props.width, props.height, props.mines));
  initBoard(model);
  populateBoard(model);
  if (props.startWithRevealedSquare || props.startWithRevealedZero) {
    revealStartingSpace(model, props.startWithRevealedZero);
  }

  return model;
};

const useModel = (props) => {
  const modelRef = useRef(null);
  if (modelRef.current === null) {
    modelRef.current = initModel(props);
  }

  return { model: modelRef.current, modelSnap: useSnapshot(modelRef.current) };
};

export default function Board(props) {
  const { model, modelSnap } = useModel(props);

  const gameWin = modelSnap.isWon;
  const gameLose = modelSnap.isLost;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameWin && !gameLose) {
        handleInterval(props, model);
      }
    }, props.autoClickIntervalMs);
    return () => clearInterval(interval);
  });

  const status = () => {
    if (gameLose) return "Mine located the hard way - you lose!";
    if (gameWin) return "All mines flagged - you win!";
    return `Flagged ${modelSnap.numFlaggedSquares} of ${props.mines} mines.`;
  };

  const renderSquare = (x, y) => {
    return (
      <Square
        key={y * props.width + x}
        onClick={() => handleClick(props, model, { x, y })}
        onFlag={(flagged) => handleFlag(props, model, { x: x, y: y }, flagged)}
        gameWin={gameWin}
        gameLose={gameLose}
        model={model.squareAt({ x: x, y: y })}
      />
    );
  };

  const renderRow = (y) => {
    return (
      <div className="board-row" key={y}>
        {Array.from({ length: props.width }, (_, i) => renderSquare(i, y))}
      </div>
    );
  };

  return (
    <div>
      <div className="status">{status()}</div>
      {Array.from({ length: props.height }, (_, i) => renderRow(i))}
    </div>
  );
}
