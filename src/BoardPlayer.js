import { snapshot } from "valtio";

export default class BoardPlayer {
  constructor(model, automationConfig) {
    this.model = model;
    this.automationConfig = automationConfig;
    this.timeoutId = null;
  }

  setAutomationConfig(automationConfig) {
    this.automationConfig = automationConfig;
  }

  handleClick(loc, snapshot) {
    const readModel = snapshot ?? this.model;
    const square = readModel.squareAt(loc);
    if (square.flagged) {
      return;
    }

    if (square.revealed) {
      if (
        (this.automationConfig.autoRevealZero && square.adjacentMines === 0) ||
        (this.automationConfig.autoRevealOne && square.adjacentMines === 1) ||
        (this.automationConfig.autoRevealTwo && square.adjacentMines === 2) ||
        (this.automationConfig.autoRevealThreePlus && square.adjacentMines >= 3)
      ) {
        if (readModel.revealAdjacentSquaresIsSafe(loc)) {
          this.model.revealAdjacentSquares(loc);
        }
      }
    }

    this.model.squareAt(loc).revealed = true;
  }

  handleFlag(loc, flagged, snapshot) {
    const readModel = snapshot ?? this.model;
    if (readModel.squareAt(loc).revealed) {
      if (
        this.automationConfig.autoFlag &&
        readModel.flagAdjacentSquaresIsSafe(loc)
      ) {
        this.model.flagAdjacentSquares(loc);
      }
    } else {
      this.model.squareAt(loc).flagged = flagged;
    }
  }

  handleInterval() {
    this.timeoutId = null;

    // Stop running forever if the board is finished.
    if (this.model.isWon || this.model.isLost) return;

    const modelSnapNotProxied = snapshot(this.model);
    // let's simulate a left and right click on every revealed square.
    for (const { square, loc } of modelSnapNotProxied.allSquares()) {
      if (square.revealed) {
        if (this.automationConfig.autoClick)
          this.handleClick(loc, modelSnapNotProxied);
        if (this.automationConfig.autoRightClick)
          this.handleFlag(loc, modelSnapNotProxied);
      }
    }

    // Restart the interval.
    this.startInterval();
  }

  startInterval() {
    this.stopInterval();

    this.timeoutId = setTimeout(() => this.handleInterval(), 250);
  }

  stopInterval() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
