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
  const model = proxy(new BoardModel(props.width, props.height, props.mines));
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
  const { model, modelSnap } = useModel(props);
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
        Flagged {modelSnap.numFlaggedSquares} of {props.mines} mines.
      </div>
    );
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
      <div className="board-container">
        <div>
          {Array.from({ length: props.height }, (_, i) => renderRow(i))}
        </div>
        {status()}
      </div>
    </div>
  );
}
