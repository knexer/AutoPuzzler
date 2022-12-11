export default class UnlockState {
  constructor() {
    this.money = 0;
    this.unlockables = [];
    this.addUnlockable(
      "autoReveal",
      "When clicking a revealed square: reveal adjacent squares, if it's safe to do so. Limited by your automation complexity level (initially zero).",
      3,
      []
    );
    this.addUnlockable(
      "autoFlag",
      "When clicking a revealed square: flag adjacent squares, if it's safe to do so. Limited by your automation complexity level (initally zero).",
      3,
      ["automationLevel1"]
    );
    this.addUnlockable(
      "automationLevel1",
      "Click rules can apply to revealed 1s.",
      6,
      ["autoReveal", "autoFlag"]
    );
    this.addUnlockable(
      "automationLevel2",
      "Click rules can apply to revealed 2s.",
      12,
      ["automationLevel1"]
    );
    this.addUnlockable(
      "automationLevelMax",
      "Click rules apply to any revealed square.",
      25,
      ["automationLevel2"]
    );
    this.addUnlockable(
      "startWithRevealedSquare",
      "Start games with one random square revealed.",
      5,
      []
    );
    this.addUnlockable(
      "startWithRevealedZero",
      "Start games with one random zero revealed.",
      25,
      ["startWithRevealedSquare"]
    );
    this.addUnlockable(
      "autoClick",
      "Apply click rules to a square, four times per second.",
      6,
      ["autoReveal", "autoFlag"]
    );
    this.addUnlockable("autoSpeed1", "Double automation speed.", 8, [
      "autoClick",
    ]);
    this.addUnlockable("autoSpeed2", "Double automation speed.", 16, [
      "autoSpeed1",
    ]);
    this.addUnlockable("autoSpeed3", "Double automation speed.", 32, [
      "autoSpeed2",
    ]);
    this.addUnlockable("autoSpeed4", "Double automation speed.", 64, [
      "autoSpeed3",
    ]);
    this.addUnlockable(
      "boardMedium",
      "Play on a bigger board, with more mines, worth more money.",
      10,
      []
    );
    this.addUnlockable(
      "boardLarge",
      "Play on an even bigger board, with even more mines, worth even more money.",
      20,
      ["boardMedium"]
    );
  }

  getUnlockedUpgrades() {
    return Object.fromEntries(
      this.unlockables.map((unlockable) => [unlockable.key, unlockable.enabled])
    );
  }

  isAvailable(unlockable) {
    return (
      unlockable.reqs.length === 0 ||
      unlockable.reqs.some((req) => this.isUnlocked(req))
    );
  }

  isUnlocked(key) {
    return this.getUnlockable(key).enabled;
  }

  getUnlockable(key) {
    return this.unlockables.find((unlockable) => unlockable.key === key);
  }

  addUnlockable(key, desc, cost, reqs) {
    this.unlockables.push({
      key: key,
      desc: desc,
      cost: cost,
      enabled: false,
      reqs: reqs,
    });
  }

  onWin(boardModel) {
    this.money += boardModel.mines;
  }
}
