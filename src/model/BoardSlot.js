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

    this.boardModel = new BoardModel(width, height, mines, () =>
      this.onGameCompleted()
    );
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

  onGameCompleted() {
    if (this.unlocks.isUnlocked("autoRestart")) {
      setTimeout(() => {
        this.completeGame();
        setTimeout(() => {
          this.startLargestUnlockedGame();
        }, 5000);
      }, 5000);
    }
  }

  completeGame() {
    if (
      this.boardModel === null ||
      (!this.boardModel.isWon && !this.boardModel.isLost)
    )
      return;

    if (this.boardModel.isWon) this.addMoney(this.boardModel.value());
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
  startLargestUnlockedGame() {
    if (this.unlocks.isUnlocked("boardLarge")) {
      this.startLargeGame();
    } else if (this.unlocks.isUnlocked("boardMedium")) {
      this.startMediumGame();
    } else {
      this.startSmallGame();
    }
  }

  handleInterval() {
    if (this.boardPlayer) this.boardPlayer.handleInterval();
    if (this.reverseBoardPlayer) this.reverseBoardPlayer.handleInterval();
  }
}
