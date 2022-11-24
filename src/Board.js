import React, { useEffect, useState } from "react";
import Square from "./Square.js";

function* adjacentSquares(squareData, x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    const newY = y + dy;
    if (newY < 0 || newY >= squareData.length) continue;

    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;
      if (newX < 0 || newX >= squareData[y].length) continue;

      yield { square: squareData[newY][newX], x: newX, y: newY };
    }
  }
}

function makeSquareData(
  width,
  height,
  mines,
  startWithRevealedSquare,
  startWithRevealedZero
) {
  const makeSquareDatum = () => {
    return { mine: false, revealed: false, flagged: false, adjacentMines: 0 };
  };

  const squareData = Array.from({ length: height }, () =>
    Array.from({ length: width }, makeSquareDatum)
  );

  const addMine = (x, y) => {
    if (squareData[y][x].mine) return false;
    squareData[y][x].mine = true;

    for (const adjSquare of adjacentSquares(squareData, x, y)) {
      adjSquare.square.adjacentMines++;
    }

    return true;
  };

  for (let i = 0; i < mines; i++) {
    let attempts = 0;
    while (attempts < 10) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (addMine(x, y)) break;
      attempts++;
    }
  }
  while (startWithRevealedZero || startWithRevealedSquare) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (!squareData[y][x].mine) {
      if (startWithRevealedZero) {
        if (squareData[y][x].adjacentMines === 0) {
          squareData[y][x].revealed = true;
          break;
        }
        continue;
      }
      squareData[y][x].revealed = true;
      break;
    }
  }

  return squareData;
}

const handleInterval = (props, squareData, setSquareData, setGameLose) => {
  // let's simulate a left and right click on every revealed square.
  for (const { square, x, y } of allSpaces(squareData)) {
    if (square.revealed) {
      if (props.autoClick)
        handleClick(props, squareData, setSquareData, setGameLose, x, y);
      if (props.autoRightClick)
        handleFlag(props, squareData, setSquareData, x, y);
    }
  }
};

const numFlaggedSpaces = (squareData) => {
  let flaggedSpaces = 0;
  for (const { square } of allSpaces(squareData)) {
    if (square.flagged) {
      flaggedSpaces++;
    }
  }

  return flaggedSpaces;
};

const numRevealedSpaces = (squareData) => {
  let revealedSpaces = 0;
  for (const { square } of allSpaces(squareData)) {
    if (square.revealed) {
      revealedSpaces++;
    }
  }

  return revealedSpaces;
};

const allSpaces = function* (squareData) {
  for (let y = 0; y < squareData.length; y++) {
    for (let x = 0; x < squareData[y].length; x++) {
      yield { square: squareData[y][x], x: x, y: y };
    }
  }
};

const updateSquare = (setSquareData, x, y, squareDatum) => {
  setSquareData((prevSquareData) => {
    return prevSquareData.map((row, i) =>
      i !== y
        ? row
        : row.map((square, j) =>
            j !== x ? square : { ...square, ...squareDatum }
          )
    );
  });
};

const revealSquare = (squareData, setSquareData, setGameLose, x, y) => {
  const squareDatum = squareData[y][x];
  if (squareDatum.revealed) return;
  if (squareDatum.flagged) return;

  updateSquare(setSquareData, x, y, { revealed: true });

  if (squareDatum.mine) {
    setGameLose(true);
  }
};

const revealAdjacentSquares = (
  squareData,
  setSquareData,
  setGameLose,
  x,
  y
) => {
  for (const adjSquare of adjacentSquares(squareData, x, y)) {
    revealSquare(
      squareData,
      setSquareData,
      setGameLose,
      adjSquare.x,
      adjSquare.y
    );
  }
};

const safeRevealAdjacentSquares = (
  squareData,
  setSquareData,
  setGameLose,
  x,
  y
) => {
  let adjacentFlagged = 0;
  for (const adjSquare of adjacentSquares(squareData, x, y)) {
    if (adjSquare.square.flagged) adjacentFlagged++;
  }
  if (adjacentFlagged >= squareData[y][x].adjacentMines) {
    revealAdjacentSquares(squareData, setSquareData, setGameLose, x, y);
  }
};

const handleClick = (props, squareData, setSquareData, setGameLose, x, y) => {
  const squareDatum = squareData[y][x];
  if (squareDatum.flagged) {
    return;
  }

  if (squareDatum.revealed) {
    if (props.safeAutoReveal >= squareDatum.adjacentMines) {
      safeRevealAdjacentSquares(squareData, setSquareData, setGameLose, x, y);
    } else if (props.autoReveal >= squareDatum.adjacentMines) {
      revealAdjacentSquares(squareData, setSquareData, setGameLose, x, y);
    }
  }

  revealSquare(squareData, setSquareData, setGameLose, x, y);
};

const flagSquare = (squareData, setSquareData, x, y, flagged) => {
  if (squareData[y][x].revealed) return;
  if (squareData[y][x].flagged === flagged) return;

  updateSquare(setSquareData, x, y, { flagged: flagged });
};

const flagAdjacentSquares = (squareData, setSquareData, x, y) => {
  for (const adjSquare of adjacentSquares(squareData, x, y)) {
    flagSquare(squareData, setSquareData, adjSquare.x, adjSquare.y, true);
  }
};

const safeFlagAdjacentSquares = (squareData, setSquareData, x, y) => {
  let adjFlaggable = 0;
  for (const adjSquare of adjacentSquares(squareData, x, y)) {
    if (adjSquare.square.flagged || !adjSquare.square.revealed) {
      adjFlaggable++;
    }
  }
  if (adjFlaggable === squareData[y][x].adjacentMines) {
    flagAdjacentSquares(squareData, setSquareData, x, y);
  }
};

const handleFlag = (props, squareData, setSquareData, x, y, flagged) => {
  if (squareData[y][x].revealed) {
    if (props.safeAutoFlag) {
      safeFlagAdjacentSquares(squareData, setSquareData, x, y);
    } else if (props.autoFlag) {
      flagAdjacentSquares(squareData, setSquareData, x, y);
    }
  } else {
    flagSquare(squareData, setSquareData, x, y, flagged);
  }
};

export default function Board(props) {
  const [squareData, setSquareData] = useState(
    makeSquareData(
      props.width,
      props.height,
      props.mines,
      props.startWithRevealedSquare,
      props.startWithRevealedZero
    )
  );
  const [gameWin, setGameWin] = useState(false);
  const [gameLose, setGameLose] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameWin && !gameLose) {
        handleInterval(props, squareData, setSquareData, setGameLose);
      }
    }, props.autoClickIntervalMs);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (
      numRevealedSpaces(squareData) + numFlaggedSpaces(squareData) ===
        props.width * props.height &&
      numFlaggedSpaces(squareData) === props.mines &&
      !gameWin &&
      !gameLose
    ) {
      setGameWin(true);
    }
  }, [squareData, props.width, props.height, props.mines, gameWin, gameLose]);

  const status = () => {
    if (gameLose) return "Mine located the hard way - you lose!";
    if (gameWin) return "All mines flagged - you win!";
    return `Flagged ${numFlaggedSpaces(squareData)} of ${props.mines} mines.`;
  };

  const renderSquare = (x, y) => {
    return (
      <Square
        key={y * props.width + x}
        onClick={() =>
          handleClick(props, squareData, setSquareData, setGameLose, x, y)
        }
        onFlag={(flagged) =>
          handleFlag(props, squareData, setSquareData, x, y, flagged)
        }
        gameWin={gameWin}
        gameLose={gameLose}
        data={squareData[y][x]}
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
