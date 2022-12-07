export default class UnlockState {
  constructor() {
    this.money = 0;
    this.unlockables = [];
    this.addUnlockable(
      "autoRevealZero",
      "Reveal adjacent squares when clicking a revealed zero."
    );
    this.addUnlockable(
      "autoRevealOne",
      "Reveal adjacent squares when clicking a revealed one with one adjacent flagged square."
    );
    this.addUnlockable(
      "autoRevealTwo",
      "Reveal adjacent squares when clicking a revealed two with two adjacent flagged squares."
    );
    this.addUnlockable(
      "autoRevealThreePlus",
      "Reveal adjacent squares when clicking a revealed 3+ with the right number of adjacent flagged squares."
    );
    this.addUnlockable(
      "autoFlag",
      "Flag adjacent squares when right clicking a revealed square, if it's trivially correct to do so."
    );
    this.addUnlockable(
      "startWithRevealedSquare",
      "Start games with one random square revealed."
    );
    this.addUnlockable(
      "startWithRevealedZero",
      "Start games with one random zero revealed."
    );
    this.addUnlockable(
      "autoClick",
      "Automatically click every revealed square every 250ms."
    );
    this.addUnlockable(
      "autoRightClick",
      "Automatically right click every revealed square every 250ms."
    );
  }

  makeAutomationConfig() {
    return Object.fromEntries(
      this.unlockables.map((unlockable) => [unlockable.key, unlockable.enabled])
    );
  }

  addUnlockable(key, desc) {
    this.unlockables.push({ key: key, desc: desc, enabled: false });
  }

  onWin(boardModel) {
    this.money++;
  }
}
