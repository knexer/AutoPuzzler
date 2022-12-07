export default class UnlockState {
  constructor() {
    this.money = 0;
    this.unlockables = [];
    this.addUnlockable(
      "autoRevealZero",
      "Reveal adjacent squares when clicking a revealed zero.",
      3
    );
    this.addUnlockable(
      "autoRevealOne",
      "Reveal adjacent squares when clicking a revealed one with one adjacent flagged square.",
      4
    );
    this.addUnlockable(
      "autoRevealTwo",
      "Reveal adjacent squares when clicking a revealed two with two adjacent flagged squares.",
      15
    );
    this.addUnlockable(
      "autoRevealThreePlus",
      "Reveal adjacent squares when clicking a revealed 3+ with the right number of adjacent flagged squares.",
      30
    );
    this.addUnlockable(
      "autoFlag",
      "Flag adjacent squares when right clicking a revealed square, if it's trivially correct to do so.",
      10
    );
    this.addUnlockable(
      "startWithRevealedSquare",
      "Start games with one random square revealed.",
      5
    );
    this.addUnlockable(
      "startWithRevealedZero",
      "Start games with one random zero revealed.",
      25
    );
    this.addUnlockable(
      "autoClick",
      "Automatically click every revealed square every 250ms.",
      10
    );
    this.addUnlockable(
      "autoRightClick",
      "Automatically right click every revealed square every 250ms.",
      10
    );
  }

  makeAutomationConfig() {
    return Object.fromEntries(
      this.unlockables.map((unlockable) => [unlockable.key, unlockable.enabled])
    );
  }

  addUnlockable(key, desc, cost) {
    this.unlockables.push({ key: key, desc: desc, cost: cost, enabled: false });
  }

  onWin(boardModel) {
    this.money += boardModel.mines;
  }
}
