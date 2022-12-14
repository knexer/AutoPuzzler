import React from "react";
import { useSnapshot } from "valtio";

const renderUnlockable = (unlockableSnap, unlockable, money, gameState) => {
  return (
    <label key={unlockableSnap.key}>
      <button
        type="button"
        className="upgrade-button"
        disabled={unlockableSnap.cost > money || unlockableSnap.enabled}
        onClick={() => {
          unlockable.enabled = true;
          gameState.money -= unlockable.cost;
        }}
      >
        ${unlockableSnap.cost}
      </button>
      {" " + unlockableSnap.desc}
    </label>
  );
};

export default function AutomationUnlockPanel(props) {
  const gameStateSnap = useSnapshot(props.gameState);
  const unlockStateSnap = gameStateSnap.unlocks;

  const availableUnlockables = [];
  const purchasedUnlockables = [];
  for (let i = 0; i < unlockStateSnap.unlockables.length; i++) {
    const renderedUnlockable = renderUnlockable(
      unlockStateSnap.unlockables[i],
      props.gameState.unlocks.unlockables[i],
      gameStateSnap.money,
      props.gameState
    );
    if (unlockStateSnap.unlockables[i].enabled) {
      purchasedUnlockables.push(renderedUnlockable);
    } else if (unlockStateSnap.isAvailable(unlockStateSnap.unlockables[i])) {
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
    </div>
  );
}
