import { snapshot } from "valtio";

export default class BoardPlayer {
  constructor(model, automationConfig) {
    this.model = model;
    this.automationConfig = automationConfig;
    this.timeoutId = null;
    this.automationLoc = { x: 0, y: 0 };
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

    // Restart interval immediately in case we crash below.
    this.startInterval();

    // Skip running for now if automation isn't unlocked yet.
    if (
      !this.automationConfig.autoClick &&
      !this.automationConfig.autoRightClick
    ) {
      return;
    }

    const modelSnapNotProxied = snapshot(this.model);
    // Simulate a left and/or right click on the square at the next automation location.
    const square = modelSnapNotProxied.squareAt(this.automationLoc);
    if (square.revealed) {
      if (this.automationConfig.autoClick)
        this.handleClick(this.automationLoc, modelSnapNotProxied);
      if (this.automationConfig.autoRightClick)
        this.handleFlag(this.automationLoc, modelSnapNotProxied);
    }

    // Move to the next square.
    this.model.squareAt(this.automationLoc).automationFocus = false;
    this.automationLoc = {
      x: this.automationLoc.x + 1,
      y: this.automationLoc.y,
    };
    if (this.automationLoc.x >= this.model.width) {
      this.automationLoc = {
        x: 0,
        y: (this.automationLoc.y + 1) % this.model.height,
      };
    }
    this.model.squareAt(this.automationLoc).automationFocus = true;
  }

  startInterval() {
    this.stopInterval();
    let numIntervalUpgrades = 0;
    if (this.automationConfig.autoSpeed1) numIntervalUpgrades++;
    if (this.automationConfig.autoSpeed2) numIntervalUpgrades++;
    if (this.automationConfig.autoSpeed3) numIntervalUpgrades++;
    if (this.automationConfig.autoSpeed4) numIntervalUpgrades++;
    this.timeoutId = setTimeout(
      () => this.handleInterval(),
      250 / Math.pow(2, numIntervalUpgrades)
    );
  }

  stopInterval() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
