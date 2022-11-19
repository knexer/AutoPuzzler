import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Board from "./Board.js";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 4,
      nextWidth: 4,
      height: 6,
      nextHeight: 6,
      mines: 3,
      nextMines: 3,
      gameId: 0,
      revealOnZero: false,
    };
  }

  handleWidthChange = (e) => {
    this.setState({ nextWidth: parseInt(e.target.value) });
  };

  handleHeightChange = (e) => {
    this.setState({ nextHeight: parseInt(e.target.value) });
  };

  handleMinesChange = (e) => {
    this.setState({ nextMines: parseInt(e.target.value) });
  };

  handleNewGame = () => {
    this.setState({
      width: this.state.nextWidth,
      height: this.state.nextHeight,
      mines: this.state.nextMines,
      gameId: this.state.gameId + 1,
    });
  };

  handleRevealOnZeroChange = (e) => {
    this.setState({ revealOnZero: !this.state.revealOnZero });
  };

  render() {
    return (
      <div className="game">
        <div className="left-panel">
          <div className="game-board">
            <Board
              width={this.state.width}
              height={this.state.height}
              mines={this.state.mines}
              revealOnZero={this.state.revealOnZero}
              key={this.state.gameId}
            />
          </div>
          <div className="game-info">
            <div>
              Width:{" "}
              <input
                type="number"
                name="Width"
                value={this.state.nextWidth}
                onChange={this.handleWidthChange}
              ></input>
            </div>
            <div>
              Height:{" "}
              <input
                type="number"
                name="Height"
                value={this.state.nextHeight}
                onChange={this.handleHeightChange}
              ></input>
            </div>
            <div>
              Mines:{" "}
              <input
                type="number"
                name="Mines"
                value={this.state.nextMines}
                onChange={this.handleMinesChange}
              ></input>
            </div>
            <button type="submit" onClick={this.handleNewGame}>
              New Game
            </button>
          </div>
        </div>
        <div className="right-panel">
          Automation options:
          <label>
            <input
              type="checkbox"
              checked={this.state.revealOnZero}
              onChange={this.handleRevealOnZeroChange}
            ></input>
            {"Reveal adjacent mines when clicking a " + 0 + "."}
          </label>
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
