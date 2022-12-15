import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
import BoardPlayer from "./BoardPlayer.js";

export default class BoardSlot {
  constructor(unlocks, addMoney) {
    this.unlocks = unlocks;
    this.addMoney = addMoney;
    this.boardModel = null;
    this.boardPlayer = null;
    this.reverseBoardPlayer = null;
  }

  startGame(width, height, mines) {
    if (this.boardModel !== null) return;

    this.boardModel = new BoardModel(width, height, mines);
    initBoard(this.boardModel);
    populateBoard(this.boardModel);
    const startWithZero = this.unlocks.isUnlocked("startWithRevealedZero");

    if (this.unlocks.isUnlocked("startWithRevealedSquare") || startWithZero) {
      revealStartingSpace(this.boardModel, startWithZero);
    }

    this.boardPlayer = new BoardPlayer(this.boardModel, this.unlocks, false);
    this.reverseBoardPlayer = new BoardPlayer(
      this.boardModel,
      this.unlocks,
      true
    );

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
    this.boardPlayer = null;
    this.reverseBoardPlayer = null;
  }

  startSmallGame() {
    return this.startGame(4, 4, 3);
  }
  startMediumGame() {
    return this.startGame(6, 6, 6);
  }
  startLargeGame() {
    return this.startGame(9, 9, 13);
  }

  handleInterval() {
    if (this.boardPlayer) this.boardPlayer.handleInterval();
    if (this.reverseBoardPlayer) this.reverseBoardPlayer.handleInterval();
  }
}
