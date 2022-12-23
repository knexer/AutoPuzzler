import React from "react";
import { useSnapshot } from "valtio";

import unlockConfig from "../UnlockConfig";

const renderUnlockable = (unlockable, unlockStateSnap, money, gameState) => {
  return (
    <label key={unlockable.key}>
      <button
        type="button"
        className="upgrade-button"
        disabled={
          unlockable.cost > money || unlockStateSnap.isUnlocked(unlockable.key)
        }
        onClick={() => {
          gameState.unlocks.unlockUpgrade(unlockable.key);
          gameState.money -= unlockable.cost;
        }}
      >
        ${unlockable.cost}
      </button>
      {" " + unlockable.desc}
    </label>
  );
};

export default function AutomationUnlockPanel(props) {
  const gameStateSnap = useSnapshot(props.gameState);
  const unlockStateSnap = gameStateSnap.unlocks;

  const availableUnlockables = [];
  const purchasedUnlockables = [];
  for (const key of unlockConfig.unlockables.keys()) {
    const unlockable = unlockConfig.getUnlockable(key);
    const renderedUnlockable = renderUnlockable(
      unlockable,
      unlockStateSnap,
      gameStateSnap.money,
      props.gameState
    );
    if (unlockStateSnap.isUnlocked(key)) {
      purchasedUnlockables.push(renderedUnlockable);
    } else if (unlockStateSnap.isAvailable(key)) {
      availableUnlockables.push(renderedUnlockable);
    }
  }

  return (
    <div className="left-panel">
      <div className="header">
        auto-sweeper <div className="money">${gameStateSnap.money}</div>
      </div>
      <div className="upgrade-list">
        Upgrades:
        {availableUnlockables}
      </div>
      {purchasedUnlockables.length > 0 && (
        <div className="upgrade-list">
          Purchased Upgrades:
          {purchasedUnlockables}
        </div>
      )}
      <div>
        Autosaves every 5 seconds.{" "}
        <button className="reset-save-button" onClick={props.resetSave}>
          !!! Reset Save !!!
        </button>
      </div>
    </div>
  );
}
