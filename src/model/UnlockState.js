import { proxyMap } from "valtio/utils";

import unlockConfig from "../UnlockConfig";

export default class UnlockState {
  constructor(deserialized = null) {
    const deserializedMap = deserialized
      ? new Map(Object.entries(deserialized))
      : new Map();
    this.unlocks = new proxyMap(
      Array.from(unlockConfig.unlockables.keys()).map((key) => [
        key,
        deserializedMap.get(key),
      ])
    );
  }

  serialize() {
    return this.getUnlockedUpgrades();
  }

  unlockUpgrade(key) {
    this.unlocks.set(key, true);
  }

  getUnlockedUpgrades() {
    return Object.fromEntries(this.unlocks);
  }

  isAvailable(key) {
    const unlockable = unlockConfig.getUnlockable(key);
    return (
      unlockable.reqs.length === 0 ||
      unlockable.reqs.some((req) => this.isUnlocked(req))
    );
  }

  isUnlocked(key) {
    return this.unlocks.get(key);
  }
}
