export default class BoardPlayer {
  constructor(model, unlocks, reverse = false) {
    this.model = model;
    this.unlocks = unlocks;
    this.timeoutId = null;
    this.automationIndex = 0;
    this.automationReverse = reverse;
    this.lastStartedVersion = -1;
  }

  get automationConfig() {
    // TODO this garbage perf
    return this.unlocks.getUnlockedUpgrades();
  }

  get automationLoc() {
    const x = this.automationIndex % this.model.width;
    const y = Math.floor(this.automationIndex / this.model.width);
    return {
      x: this.automationReverse ? this.model.width - 1 - x : x,
      y: this.automationReverse ? this.model.height - 1 - y : y,
    };
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
    // Nothing to do if the board is finished.
    if (this.model.isWon || this.model.isLost) return;

    // Nothing to do if we're reverse and reversed autoclicker isn't unlocked yet.
    if (this.automationReverse && !this.automationConfig.twoWorkers) {
      return;
    }

    if (this.automationIndex === 0) {
      // Nothing to do if the board hasn't changed since we started our previous loop.
      if (this.lastStartedVersion === this.model.version) {
        return;
      }
      this.lastStartedVersion = this.model.version;
    }

    // Simulate a left and/or right click on the square at the next automation location.
    const square = this.model.squareAt(this.automationLoc);
    if (square.revealed) {
      this.applyAutomationRules(this.automationLoc, this.model);
    }

    // Move to the next square.
    if (this.model.squareAt(this.automationLoc).automationFocus > 0)
      this.model.squareAt(this.automationLoc).automationFocus--;
    this.automationIndex =
      (this.automationIndex + 1) % (this.model.width * this.model.height);
    this.model.squareAt(this.automationLoc).automationFocus++;
  }
}
