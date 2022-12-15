import { proxy } from "valtio";

import BoardSlot from "./BoardSlot.js";
import UnlockState from "./UnlockState.js";

// A root class for the state of the game as a whole.
// Owns the player's money, the upgrades the player has unlocked, and (shortly) all of the currently going games.
export default class GameState {
  constructor() {
    this.money = 0;
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
}
