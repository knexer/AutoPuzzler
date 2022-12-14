import { proxy } from "valtio";

import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
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

  startGame(width, height, mines) {
    const model = proxy(new BoardModel(width, height, mines));
    initBoard(model);
    populateBoard(model);
    const startWithZero = this.unlocks.isUnlocked("startWithRevealedZero");

    if (this.unlocks.isUnlocked("startWithRevealedSquare") || startWithZero) {
      revealStartingSpace(model, startWithZero);
    }

    return model;
  }

  addBoardSlot() {
    const boardSlot = proxy({
      boardModel: null,
      completeGame: () => {
        const boardModel = boardSlot.boardModel;
        if (boardModel === null || (!boardModel.isWon && !boardModel.isLost))
          return;

        if (boardModel.isWon) this.money += boardModel.mines;
        boardSlot.boardModel = null;
      },
      startSmallGame: () => {
        if (boardSlot.boardModel !== null) return;
        boardSlot.boardModel = this.startGame(4, 4, 3);
      },
      startMediumGame: () => {
        if (boardSlot.boardModel !== null) return;
        boardSlot.boardModel = this.startGame(6, 6, 6);
      },
      startLargeGame: () => {
        if (boardSlot.boardModel !== null) return;
        boardSlot.boardModel = this.startGame(9, 9, 13);
      },
    });
    this.boardSlots.push(boardSlot);
  }
}
