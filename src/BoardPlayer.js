import { snapshot } from "valtio";

export default class BoardPlayer {
  constructor(model, automationConfig) {
    this.model = model;
    this.automationConfig = automationConfig;
    this.timeoutId = null;
    this.automationLoc = { x: 0, y: 0 };
    this.lastStartedVersion = -1;
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
      this.applyAutomationRules(loc, readModel);
    }

    this.model.squareAt(loc).revealed = true;
  }

  handleFlag(loc, flagged, snapshot) {
    const readModel = snapshot ?? this.model;
    if (readModel.squareAt(loc).revealed) {
      this.applyAutomationRules(loc, readModel);
    } else {
      this.model.squareAt(loc).flagged = flagged;
    }
  }

  canApplyToSquare(square) {
    const mines = square.adjacentMines;
    if (mines === 0) return true;
    if (mines === 1 && this.automationConfig.automationLevel1) return true;
    if (mines === 2 && this.automationConfig.automationLevel2) return true;
    if (this.automationConfig.automationLevelMax) return true;
    return false;
  }

  applyAutomationRules(loc, readModel) {
    const square = readModel.squareAt(loc);

    if (this.canApplyToSquare(square)) {
      if (
        this.automationConfig.autoReveal &&
        readModel.revealAdjacentSquaresIsSafe(loc)
      ) {
        this.model.revealAdjacentSquares(loc);
      }

      if (
        this.automationConfig.autoFlag &&
        readModel.flagAdjacentSquaresIsSafe(loc)
      ) {
        this.model.flagAdjacentSquares(loc);
      }
    }
  }

  handleInterval() {
    this.timeoutId = null;

    // Stop running forever if the board is finished.
    if (this.model.isWon || this.model.isLost) return;

    // Restart interval immediately in case we crash below.
    this.startInterval();

    // Skip running for now if automation isn't unlocked yet.
    if (!this.automationConfig.autoClick) {
      return;
    }

    if (this.automationLoc.x === 0 && this.automationLoc.y === 0) {
      // Skip running for now if the board hasn't changed since we started our loop.
      if (this.lastStartedVersion === this.model.version) {
        return;
      }
      this.lastStartedVersion = this.model.version;
    }

    const modelSnapNotProxied = snapshot(this.model);
    // Simulate a left and/or right click on the square at the next automation location.
    const square = modelSnapNotProxied.squareAt(this.automationLoc);
    if (square.revealed) {
      this.applyAutomationRules(this.automationLoc, modelSnapNotProxied);
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
