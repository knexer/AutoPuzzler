import { proxy } from "valtio";

import BoardSlot from "./BoardSlot.js";
import UnlockState from "./UnlockState.js";

// A root class for the state of the game as a whole.
// Owns the player's money, the upgrades the player has unlocked, and (shortly) all of the currently going games.
export default class GameState {
  constructor() {
    this.money = 100;
    this.unlocks = proxy(new UnlockState());
    this.boardSlots = [];
  }

  init() {
    this.addBoardSlot();
    this.addBoardSlot();
    this.addBoardSlot();
    this.addBoardSlot();
  }

  onWin(boardModel) {
    this.money += boardModel.mines;
  }

  addMoney(money) {
    this.money += money;
  }

  addBoardSlot() {
    this.boardSlots.push(
      new BoardSlot(this.unlocks, (money) => this.addMoney(money))
    );
  }

  handleInterval() {
    this.timeoutId = null;

    // Restart interval immediately in case we crash below.
    this.startInterval();

    // Skip running for now if automation isn't unlocked yet.
    if (!this.unlocks.isUnlocked("autoClick")) {
      return;
    }

    this.boardSlots.forEach((slot) => slot.handleInterval());
  }

  startInterval() {
    this.stopInterval();
    let numIntervalUpgrades = 0;
    if (this.unlocks.isUnlocked("autoSpeed1")) numIntervalUpgrades++;
    if (this.unlocks.isUnlocked("autoSpeed2")) numIntervalUpgrades++;
    if (this.unlocks.isUnlocked("autoSpeed3")) numIntervalUpgrades++;
    if (this.unlocks.isUnlocked("autoSpeed4")) numIntervalUpgrades++;
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
