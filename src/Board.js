import React, { useEffect, useRef } from "react";
import { proxy, useSnapshot } from "valtio";
import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
import BoardPlayer from "./BoardPlayer.js";
import Square from "./Square.js";

const initModel = (props) => {
  const model = proxy(
    new BoardModel(props.width, props.height, props.mines, props.onWin)
  );
  initBoard(model);
  populateBoard(model);
  if (
    props.automationConfig.startWithRevealedSquare ||
    props.automationConfig.startWithRevealedZero
  ) {
    revealStartingSpace(model, props.automationConfig.startWithRevealedZero);
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

const useBoardPlayer = (props, model) => {
  const boardPlayerRef = useRef(null);
  if (boardPlayerRef.current === null) {
    boardPlayerRef.current = new BoardPlayer(model, props.automationConfig);
  }

  useEffect(() => {
    boardPlayerRef.current.startInterval();

    return () => boardPlayerRef.current.stopInterval();
  }, []);

  boardPlayerRef.current.setAutomationConfig(props.automationConfig);

  return boardPlayerRef.current;
};

export default function Board(props) {
  const { model, modelSnap } = useModel(props);
  const boardPlayer = useBoardPlayer(props, model);

  const gameWin = modelSnap.isWon;
  const gameLose = modelSnap.isLost;

  const status = () => {
    if (gameLose) return "Mine located the hard way - you lose!";
    if (gameWin) return "All mines flagged - you win!";
    return `Flagged ${modelSnap.numFlaggedSquares} of ${props.mines} mines.`;
  };

  const renderSquare = (x, y) => {
    return (
      <Square
        key={y * props.width + x}
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
