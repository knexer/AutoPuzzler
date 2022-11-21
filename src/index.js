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
      autoRevealEnabled: false,
      autoRevealMax: 0,
      safeAutoRevealEnabled: false,
      safeAutoRevealMax: 0,
      autoFlagEnabled: false,
      safeAutoFlagEnabled: false,
      startWithRevealedSquare: false,
      startWithRevealedZero: false,
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

  renderCheckbox = (name) => {
    return (
      <input
        type="checkbox"
        checked={this.state[name]}
        onChange={() =>
          this.setState({
            [name]: !this.state[name],
          })
        }
      ></input>
    );
  };

  renderAdjacentCount = (enabled, name) => {
    return (
      <input
        type="number"
        value={this.state[name]}
        onChange={(e) => this.setState({ [name]: parseInt(e.target.value) })}
        min="0"
        max="7"
        disabled={!this.state[enabled]}
      />
    );
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
              startWithRevealedSquare={this.state.startWithRevealedSquare}
              startWithRevealedZero={this.state.startWithRevealedZero}
              autoReveal={
                this.state.autoRevealEnabled ? this.state.autoRevealMax : -1
              }
              safeAutoReveal={
                this.state.safeAutoRevealEnabled
                  ? this.state.safeAutoRevealMax
                  : -1
              }
              autoFlag={this.state.autoFlagEnabled}
              safeAutoFlag={this.state.safeAutoFlagEnabled}
              autoIntervalMs={250}
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
            {this.renderCheckbox("autoRevealEnabled")} Reveal adjacent squares
            when clicking a revealed square with up to{" "}
            {this.renderAdjacentCount("autoRevealEnabled", "autoRevealMax")}{" "}
            adjacent mines.
          </label>
          <label>
            {this.renderCheckbox("safeAutoRevealEnabled")} Reveal adjacent
            squares when clicking a revealed square with up to{" "}
            {this.renderAdjacentCount(
              "safeAutoRevealEnabled",
              "safeAutoRevealMax"
            )}{" "}
            adjacent <em>flagged</em> mines.
          </label>
          <label>
            {this.renderCheckbox("autoFlagEnabled")} Flag adjacent squares when
            right clicking a revealed square.
          </label>
          <label>
            {this.renderCheckbox("safeAutoFlagEnabled")} Flag adjacent squares
            when right clicking a revealed square that has a number of adjacent
            unrevealed or flagged squares equal to its adjacent mines count.
          </label>
          <label>
            {this.renderCheckbox("startWithRevealedSquare")} Start games with
            one random square revealed.
          </label>
          <label>
            {this.renderCheckbox("startWithRevealedZero")} Start games with one
            random square revealed that has no adjacent mines.
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
