import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  handleClick() {
    if (
      this.props.data.revealed ||
      this.props.data.flagged ||
      this.props.locked
    )
      return;
    this.props.onClick();
  }

  handleFlag() {
    if (this.props.data.revealed || this.props.locked) return;
    this.props.onFlag(!this.props.data.flagged);
  }

  render() {
    const display = () => {
      if (this.props.data.revealed)
        return this.props.data.mine ? "🤯" : this.props.data.adjacentMines;
      if (this.props.data.flagged) return "🚩";
      return "";
    };

    return (
      <button
        className="square"
        onClick={() => this.handleClick()}
        onContextMenu={(e) => {
          e.preventDefault();
          this.handleFlag();
        }}
      >
        {display()}
      </button>
    );
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

    for (let dy = -1; dy <= 1; dy++) {
      const newY = y + dy;
      if (newY < 0 || newY >= squareData.length) continue;

      for (let dx = -1; dx <= 1; dx++) {
        const newX = x + dx;
        if (newX < 0 || newX >= squareData[y].length) continue;
        squareData[newY][newX].adjacentMines++;
      }
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

class Board extends React.Component {
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

  updateSquare(x, y, squareDatum) {
    this.setState({
      squareData: this.state.squareData.map((row, i) =>
        i !== y
          ? row
          : row.map((square, j) =>
              j !== x ? square : { ...square, ...squareDatum }
            )
      ),
    });
  }

  handleClick(x, y) {
    this.updateSquare(x, y, { revealed: true });
    const nextRevealedSpaces = this.state.revealedSpaces + 1;
    this.setState({ revealedSpaces: nextRevealedSpaces });

    if (this.state.squareData[y][x].mine) {
      this.setState({ gameLose: true });
    } else if (
      nextRevealedSpaces + this.props.mines ===
      this.props.width * this.props.height
    ) {
      this.setState({ gameWin: true });
    }
  }

  handleFlag(x, y, flagged) {
    this.updateSquare(x, y, { flagged: flagged });

    this.setState({
      flaggedMines: this.state.flaggedMines + (flagged ? 1 : -1),
    });
  }

  renderSquare(x, y) {
    return (
      <Square
        x={x}
        y={y}
        key={y * this.props.width + x}
        onClick={() => this.handleClick(x, y)}
        onFlag={(flagged) => this.handleFlag(x, y, flagged)}
        locked={this.state.gameWin || this.state.gameLose}
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
      return `Flagged ${this.state.flaggedMines} of ${this.props.mines} mines on the board.`;
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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board width={4} height={6} mines={3} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Game />
  </StrictMode>
);
