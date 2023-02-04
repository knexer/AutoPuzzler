import BoardModel, {
  initBoard,
  populateBoard,
  revealStartingSpace,
} from "./BoardModel.js";
import BoardPlayer from "./BoardPlayer.js";

// state can be one of:
// running, waitingToStart, waitingToFinish

export default class BoardSlot {
  constructor(unlocks, addMoney) {
    this.unlocks = unlocks;
    this.addMoney = addMoney;
    this.boardModel = null;
    this.boardPlayer = null;
    this.reverseBoardPlayer = null;
    this.state = "waitingToStart";
    this.ticksToNextState = this.autoRestartDelay();
  }

  autoRestartDelay(won = true) {
    const shortDelay = 4 * 10;
    const longDelay = shortDelay * this.unlocks.automationSpeed();
    if (won && this.unlocks.isUnlocked("autoRestart2")) return shortDelay;
    if (!won && this.unlocks.isUnlocked("autoRestart3")) return longDelay;
    if (won && this.unlocks.isUnlocked("autoRestart")) return longDelay;

    return undefined;
  }

  startGame(width, height, mines) {
    if (this.boardModel !== null) return;

    this.state = "running";

    this.boardModel = new BoardModel(width, height, mines, (won) =>
      this.onGameCompleted(won)
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

  onGameCompleted(won) {
    this.state = "waitingToFinish";
    this.ticksToNextState = this.autoRestartDelay(won);
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

    this.state = "waitingToStart";
    this.ticksToNextState = this.autoRestartDelay();
  }

  startSmallGame() {
    return this.startGame(4, 4, 3);
  }
  startMediumGame() {
    return this.startGame(6, 6, 7);
  }
  startLargeGame() {
    return this.startGame(9, 9, 14);
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

    if (this.unlocks.isUnlocked("autoRestart")) {
      if (this.state === "waitingToStart") {
        this.ticksToNextState--;
        if (this.ticksToNextState <= 0) {
          this.startLargestUnlockedGame();
        }
      } else if (this.state === "running") {
        // Nothing here
      } else if (this.state === "waitingToFinish") {
        this.ticksToNextState--;
        if (this.ticksToNextState <= 0) {
          this.completeGame();
        }
      }
    }
  }
}
