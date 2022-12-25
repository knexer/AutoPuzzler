class UnlockConfig {
  constructor() {
    this.unlockables = new Map();
    this.addUnlockable(
      "mulligans1",
      "Guess Armor 1",
      "Get one mulligan (🛡️) that saves you if you would trigger a mine.",
      3,
      []
    );
    this.addUnlockable(
      "mulligans2",
      "Guess Armor 2",
      "Get a second mulligan (🛡️).",
      60,
      ["mulligans1"]
    );
    this.addUnlockable(
      "mulligans3",
      "Guess Armor 3",
      "Get a third mulligan (🛡️).",
      100,
      ["mulligans2"]
    );
    this.addUnlockable(
      "autoReveal",
      "Safe Auto-Reveal",
      "When clicking a revealed square: reveal adjacent squares, if it's safe to do so. Limited by your automation intelligence level.",
      3,
      []
    );
    this.addUnlockable(
      "autoFlag",
      "Safe Auto-Flag",
      "When clicking a revealed square: flag adjacent squares, if it's safe to do so. Limited by your automation intelligence level.",
      3,
      ["automationLevel1"]
    );
    this.addUnlockable(
      "automationLevel1",
      "Smart Automation 1",
      "Click rules can apply to revealed 1s.",
      6,
      ["autoReveal", "autoFlag"]
    );
    this.addUnlockable(
      "automationLevel2",
      "Smart Automation 2",
      "Click rules can apply to revealed 2s.",
      12,
      ["automationLevel1"]
    );
    this.addUnlockable(
      "automationLevelMax",
      "Smart Automation ∞",
      "Click rules apply to any revealed square.",
      25,
      ["automationLevel2"]
    );
    this.addUnlockable(
      "startWithRevealedSquare",
      "Safe Start 1",
      "Start games with one random square revealed.",
      5,
      []
    );
    this.addUnlockable(
      "startWithRevealedZero",
      "Safe Start 2",
      "Start games with one random zero revealed.",
      25,
      ["startWithRevealedSquare"]
    );
    this.addUnlockable(
      "autoClick",
      "Autoclicker",
      "Apply click rules to four squares per second.",
      6,
      ["autoReveal", "autoFlag"]
    );
    this.addUnlockable(
      "multiBoard1",
      "Multiboard 1",
      "Add a second board with its own autoclicker.",
      20,
      ["autoClick"]
    );
    this.addUnlockable(
      "multiBoard2",
      "Multiboard 2",
      "Add a third board with its own autoclicker.",
      30,
      ["multiBoard1"]
    );
    this.addUnlockable(
      "multiBoard3",
      "Multiboard 3",
      "Add a fourth board with its own autoclicker.",
      50,
      ["multiBoard2"]
    );
    this.addUnlockable(
      "autoRestart",
      "Auto-restart",
      "Automatically restart ended boards after ten seconds, at the largest unlocked size.",
      50,
      ["multiBoard2"]
    );
    this.addUnlockable(
      "autoSpeed1",
      "Fast Autoclicker 1",
      "Double automation speed.",
      8,
      ["autoClick"]
    );
    this.addUnlockable(
      "autoSpeed2",
      "Fast Autoclicker 2",
      "Double automation speed.",
      16,
      ["autoSpeed1"]
    );
    this.addUnlockable(
      "autoSpeed3",
      "Fast Autoclicker 3",
      "Double automation speed.",
      32,
      ["autoSpeed2"]
    );
    this.addUnlockable(
      "autoSpeed4",
      "Fast Autoclicker 4",
      "Double automation speed.",
      64,
      ["autoSpeed3"]
    );
    this.addUnlockable(
      "twoWorkers",
      "Two Autoclickers",
      "Add another autoclicker to each board that runs in the opposite direction.",
      50,
      ["autoSpeed1"]
    );
    this.addUnlockable(
      "boardMedium",
      "Medium Board",
      "Play on a bigger board, with more mines, worth more money.",
      8,
      []
    );
    this.addUnlockable(
      "boardLarge",
      "Large Board",
      "Play on an even bigger board, with even more mines, worth even more money.",
      20,
      ["boardMedium"]
    );
  }

  addUnlockable(key, title, desc, cost, reqs) {
    this.unlockables.set(key, {
      key: key,
      title: title,
      desc: desc,
      cost: cost,
      reqs: reqs,
    });
  }

  getUnlockable(key) {
    return this.unlockables.get(key);
  }
}
const unlockConfig = new UnlockConfig();
export default unlockConfig;
