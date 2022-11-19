import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Board from "./Board.js";

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
