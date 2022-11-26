import SquareModel from "./SquareModel.js";
import { proxy } from "valtio";

const initBoard = (boardModel) => {
  boardModel.squares = Array.from({ length: boardModel.height }, (_, y) =>
    Array.from({ length: boardModel.width }, (_, x) =>
      proxy(
        new SquareModel(() => boardModel.handleSquareChanged({ x: x, y: y }))
      )
    )
  );
};

const populateBoard = (boardModel) => {
  for (let i = 0; i < boardModel.mines; i++) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const x = Math.floor(Math.random() * boardModel.width);
      const y = Math.floor(Math.random() * boardModel.height);
      if (boardModel.tryAddMine({ x: x, y: y })) break;
    }
  }
};

const revealStartingSpace = (boardModel, mustBeZero) => {
  while (true) {
    const randomSquare = boardModel.squareAt({
      x: Math.floor(Math.random() * boardModel.width),
      y: Math.floor(Math.random() * boardModel.height),
    });

    if (randomSquare.mine) continue;

    if (!mustBeZero || randomSquare.adjacentMines === 0) {
      randomSquare.revealed = true;
      break;
    }
  }
};

export default class BoardModel {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.isWon = false;
    this.isLost = false;
    this.numFlaggedSquares = 0;
    this.squares = Array[0];
  }

  handleSquareChanged(loc) {
    this.isWon = this.allSquares().every(({ square }) => {
      return square.mine ? square.flagged : square.revealed;
    });

    this.isLost = this.allSquares().some(({ square }) => {
      return square.mine && square.revealed;
    });

    this.numFlaggedSquares = this.allSquares().filter(
      ({ square }) => square.flagged
    ).length;
  }

  squareAt({ x, y }) {
    return this.squares[y][x];
  }

  adjacentSquares({ x, y }) {
    let squares = [];
    for (let dy = -1; dy <= 1; dy++) {
      const newY = y + dy;
      if (newY < 0 || newY >= this.height) continue;

      for (let dx = -1; dx <= 1; dx++) {
        const newX = x + dx;
        if (newX < 0 || newX >= this.width) continue;

        squares.push({
          square: this.squareAt({ x: newX, y: newY }),
          x: newX,
          y: newY,
        });
      }
    }
    return squares;
  }

  allSquares() {
    return this.squares.flatMap((arr, y) =>
      arr.map((square, x) => {
        return { square: square, loc: { x: x, y: y } };
      })
    );
  }

  tryAddMine(loc) {
    const square = this.squareAt(loc);

    if (square.mine) return false;
    square.mine = true;

    for (const adjSquare of this.adjacentSquares(loc)) {
      adjSquare.square.adjacentMines++;
    }

    return true;
  }

  revealAdjacentSquares(loc) {
    this.adjacentSquares(loc).forEach(({ square }) => (square.revealed = true));
  }

  safeRevealAdjacentSquares(loc) {
    const adjacentFlagged = this.adjacentSquares(loc).filter(
      ({ square }) => square.flagged
    ).length;
    if (adjacentFlagged >= this.squareAt(loc).adjacentMines) {
      this.revealAdjacentSquares(loc);
    }
  }

  flagAdjacentSquares(loc) {
    this.adjacentSquares(loc).forEach(({ square }) => (square.flagged = true));
  }

  safeFlagAdjacentSquares(loc) {
    const adjacentFlaggable = this.adjacentSquares(loc).filter(
      ({ square }) => square.flagged || !square.revealed
    ).length;
    if (adjacentFlaggable === this.squareAt(loc).adjacentMines) {
      this.flagAdjacentSquares(loc);
    }
  }
}

export { initBoard, populateBoard, revealStartingSpace };
