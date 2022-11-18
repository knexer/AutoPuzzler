import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayedValue: "" };
  }

  handleClick() {
    this.setState({ displayedValue: this.props.value });
    this.props.onClick();
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.handleClick()}
        onContextMenu={(e) => {
          e.preventDefault();
          this.handleClick();
        }}
      >
        {this.state.displayedValue}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.secretSquares = Array.from({ length: props.height }, () =>
      Array(props.width).fill(0)
    );

    const addMine = (x, y) => {
      if (this.secretSquares[y][x] === "X") return false;
      this.secretSquares[y][x] = "X";

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
      const x = Math.floor(Math.random() * props.width);
      const y = Math.floor(Math.random() * props.height);
      if (!addMine(x, y)) {
        i--;
      }
    }
  }

  handleClick(x, y) {
    // TODO detect win/loss here, update mine count
  }

  renderSquare(x, y) {
    return (
      <Square
        x={x} // debug purposes
        y={y} // debug purposes
        key={x}
        onClick={() => this.handleClick(x, y)}
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
    const status = `Minimum playable minesweeper with no win/loss detection.
    Find the ${this.props.mines} mines on the board.`;

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
