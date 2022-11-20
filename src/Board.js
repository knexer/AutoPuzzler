import React from "react";
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

function makeSquareData(width, height, mines) {
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

  return squareData;
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squareData: makeSquareData(props.width, props.height, props.mines),
      flaggedMines: 0,
      revealedSpaces: 0,
      gameWin: false,
      gameLose: false,
    };
  }

  componentDidUpdate() {
    if (
      this.state.revealedSpaces + this.props.mines ===
        this.props.width * this.props.height &&
      !this.state.gameWin &&
      !this.state.gameLose
    ) {
      this.setState({ gameWin: true });
    }
  }

  updateSquare(x, y, squareDatum) {
    this.setState((prevState) => ({
      squareData: prevState.squareData.map((row, i) =>
        i !== y
          ? row
          : row.map((square, j) =>
              j !== x ? square : { ...square, ...squareDatum }
            )
      ),
    }));
  }

  handleClick(x, y) {
    const squareDatum = this.state.squareData[y][x];
    if (this.state.gameLose || this.state.gameWin || squareDatum.flagged) {
      return;
    }

    const revealSquare = (x, y) => {
      const squareDatum = this.state.squareData[y][x];
      if (squareDatum.revealed) return;
      if (squareDatum.flagged) return;

      this.updateSquare(x, y, { revealed: true });
      this.setState((prevState) => ({
        revealedSpaces: prevState.revealedSpaces + 1,
      }));

      if (squareDatum.mine) {
        this.setState({ gameLose: true });
      }
    };

    const revealAdjacentSquares = () => {
      for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
        revealSquare(adjSquare.x, adjSquare.y);
      }
    };

    if (squareDatum.revealed) {
      if (this.props.safeAutoReveal >= squareDatum.adjacentMines) {
        let adjacentFlagged = 0;
        for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
          if (adjSquare.square.flagged) adjacentFlagged++;
        }
        if (adjacentFlagged >= squareDatum.adjacentMines) {
          revealAdjacentSquares();
        }
      } else if (this.props.autoReveal >= squareDatum.adjacentMines) {
        revealAdjacentSquares();
      }
    }

    revealSquare(x, y);
  }

  handleFlag(x, y, flagged) {
    if (this.state.gameLose || this.state.gameWin) {
      return;
    }

    const flagSquare = (x, y, flagged) => {
      if (this.state.squareData[y][x].revealed) return;
      if (this.state.squareData[y][x].flagged === flagged) return;

      this.updateSquare(x, y, { flagged: flagged });

      this.setState((prevState) => ({
        flaggedMines: prevState.flaggedMines + (flagged ? 1 : -1),
      }));
    };

    const flagAdjacentSquares = () => {
      for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
        flagSquare(adjSquare.x, adjSquare.y, true);
      }
    };

    if (this.state.squareData[y][x].revealed) {
      if (this.props.safeAutoFlag) {
        let adjFlaggable = 0;
        for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
          if (adjSquare.square.flagged || !adjSquare.square.revealed) {
            adjFlaggable++;
          }
        }
        if (adjFlaggable === this.state.squareData[y][x].adjacentMines) {
          flagAdjacentSquares();
        }
      } else if (this.props.autoFlag) {
        flagAdjacentSquares();
      }
    } else {
      flagSquare(x, y, flagged);
    }
  }

  renderSquare(x, y) {
    return (
      <Square
        key={y * this.props.width + x}
        onClick={() => this.handleClick(x, y)}
        onFlag={(flagged) => this.handleFlag(x, y, flagged)}
        gameWin={this.state.gameWin}
        gameLose={this.state.gameLose}
        data={this.state.squareData[y][x]}
      />
    );
  }

  renderRow(y) {
    return (
      <div className="board-row" key={y}>
        {Array.from({ length: this.props.width }, (step, i) =>
          this.renderSquare(i, y)
        )}
      </div>
    );
  }

  render() {
    const status = () => {
      if (this.state.gameLose) return "Mine located the hard way - you lose!";
      if (this.state.gameWin) return "All mines flagged - you win!";
      return `Flagged ${this.state.flaggedMines} of ${this.props.mines} mines.`;
    };

    return (
      <div>
        <div className="status">{status()}</div>
        {Array.from({ length: this.props.height }, (element, i) =>
          this.renderRow(i)
        )}
      </div>
    );
  }
}
