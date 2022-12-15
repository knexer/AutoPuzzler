import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";

export default class BoardSlot {
  constructor(unlocks, addMoney) {
    this.unlocks = unlocks;
    this.addMoney = addMoney;
    this.boardModel = null;
  }

  startGame(width, height, mines) {
    this.boardModel = new BoardModel(width, height, mines);
    initBoard(this.boardModel);
    populateBoard(this.boardModel);
    const startWithZero = this.unlocks.isUnlocked("startWithRevealedZero");

    if (this.unlocks.isUnlocked("startWithRevealedSquare") || startWithZero) {
      revealStartingSpace(this.boardModel, startWithZero);
    }

    return this.boardModel;
  }

  completeGame() {
    if (
      this.boardModel === null ||
      (!this.boardModel.isWon && !this.boardModel.isLost)
    )
      return;

    if (this.boardModel.isWon) this.addMoney(this.boardModel.mines);
    this.boardModel = null;
  }

  startSmallGame() {
    if (this.boardModel !== null) return;
    return this.startGame(4, 4, 3);
  }
  startMediumGame() {
    if (this.boardModel !== null) return;
    return this.startGame(6, 6, 6);
  }
  startLargeGame() {
    if (this.boardModel !== null) return;
    return this.startGame(9, 9, 13);
  }
}
