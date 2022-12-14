import UnlockState from "./UnlockState.js";

// A root class for the state of the game as a whole.
// Owns the player's money, the upgrades the player has unlocked, and (shortly) all of the currently going games.
export default class GameState {
  constructor() {
    this.money = 0;
    this.unlocks = new UnlockState();
  }

  onWin(boardModel) {
    this.money += boardModel.mines;
  }
}
