import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { revealed: false, flagged: false };
  }

  handleClick() {
    if (this.state.revealed || this.state.flagged || this.props.locked) return;
    this.setState({ revealed: true });
    this.props.onClick();
  }

  handleFlag() {
    if (this.state.revealed || this.props.locked) return;
    const nextFlagged = !this.state.flagged;
    this.setState({ flagged: nextFlagged });
    this.props.onFlag(nextFlagged);
  }

  render() {
    const value = () => {
      if (this.state.revealed) return this.props.value;
      if (this.state.flagged) return "🚩";
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
        {value()}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flaggedMines: 0, gameOver: false };

    this.secretSquares = Array.from({ length: props.height }, () =>
      Array(props.width).fill(0)
    );

    const addMine = (x, y) => {
      if (this.secretSquares[y][x] === "🤯") return false;
      this.secretSquares[y][x] = "🤯";

      for (let dy = -1; dy <= 1; dy++) {
        const newY = y + dy;
        if (newY < 0 || newY >= this.secretSquares.length) continue;

        for (let dx = -1; dx <= 1; dx++) {
          const newX = x + dx;
          if (newX < 0 || newX >= this.secretSquares[y].length) continue;
          if (isNaN(this.secretSquares[newY][newX])) continue;

          this.secretSquares[newY][newX]++;
        }
      }

      return true;
    };

    for (let i = 0; i < props.mines; i++) {
      let attempts = 0;
      while (attempts < 10) {
        const x = Math.floor(Math.random() * props.width);
        const y = Math.floor(Math.random() * props.height);
        if (addMine(x, y)) break;
        attempts++;
      }
    }
  }

  handleClick(x, y) {
    // TODO if all non-mine squares are revealed, game is win.
    // But we can't check the state of child components??
    // React seems to want me to 'lift state up' i.e. make a god class.
    // But I suspect the real answer is that gameplay code doesn't belong in React.

    if (this.secretSquares[y][x] === "🤯") {
      this.setState({ gameOver: true });
    }
  }

  handleFlag(x, y, flagged) {
    this.setState({
      flaggedMines: this.state.flaggedMines + (flagged ? 1 : -1),
    });
  }

  renderSquare(x, y) {
    return (
      <Square
        x={x} // debug purposes
        y={y} // debug purposes
        key={x}
        onClick={() => this.handleClick(x, y)}
        onFlag={(flagged) => this.handleFlag(x, y, flagged)}
        locked={this.state.gameOver}
        value={this.secretSquares[y][x]}
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
    const status = this.state.gameOver
      ? "Game Over!"
      : `Found ${this.state.flaggedMines} of ${this.props.mines} mines on the board.`;

    return (
      <div>
        <div className="status">{status}</div>
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
