import React, { useEffect, useRef } from "react";
import { proxy, useSnapshot, snapshot } from "valtio";
import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
import Square from "./Square.js";

const handleInterval = (props, model) => {
  const modelSnapNotProxied = snapshot(model);
  // let's simulate a left and right click on every revealed square.
  for (const { square, loc } of modelSnapNotProxied.allSquares()) {
    if (square.revealed) {
      if (props.autoClick) handleClick(props, model, modelSnapNotProxied, loc);
      if (props.autoRightClick)
        handleFlag(props, model, modelSnapNotProxied, loc);
    }
  }
};

const handleClick = (props, writeModel, readModel, loc) => {
  const square = readModel.squareAt(loc);
  if (square.flagged) {
    return;
  }

  if (square.revealed) {
    if (
      props.safeAutoReveal >= square.adjacentMines &&
      readModel.revealAdjacentSquaresIsSafe(loc)
    ) {
      writeModel.revealAdjacentSquares(loc);
    } else if (props.autoReveal >= square.adjacentMines) {
      writeModel.revealAdjacentSquares(loc);
    }
  }

  writeModel.squareAt(loc).revealed = true;
};

const handleFlag = (props, writeModel, readModel, loc, flagged) => {
  if (readModel.squareAt(loc).revealed) {
    if (props.safeAutoFlag && readModel.flagAdjacentSquaresIsSafe(loc)) {
      writeModel.flagAdjacentSquares(loc);
    } else if (props.autoFlag) {
      writeModel.flagAdjacentSquares(loc);
    }
  } else {
    writeModel.squareAt(loc).flagged = flagged;
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

const useAutoClick = (props, model, isWon, isLost) => {
  const savedCallback = useRef(null);
  savedCallback.current = () => {
    if (!isWon && !isLost) {
      handleInterval(props, model);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(
      () => savedCallback.current(),
      props.autoClickIntervalMs
    );

    return () => clearInterval(intervalId);
  }, [props.autoClickIntervalMs]);
};

export default function Board(props) {
  const { model, modelSnap } = useModel(props);

  const gameWin = modelSnap.isWon;
  const gameLose = modelSnap.isLost;

  useAutoClick(props, model, gameWin, gameLose);

  const status = () => {
    if (gameLose) return "Mine located the hard way - you lose!";
    if (gameWin) return "All mines flagged - you win!";
    return `Flagged ${modelSnap.numFlaggedSquares} of ${props.mines} mines.`;
  };

  const renderSquare = (x, y) => {
    return (
      <Square
        key={y * props.width + x}
        onClick={() => handleClick(props, model, model, { x, y })}
        onFlag={(flagged) =>
          handleFlag(props, model, model, { x: x, y: y }, flagged)
        }
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
