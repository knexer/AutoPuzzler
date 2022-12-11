import React from "react";
import { useSnapshot } from "valtio";

const renderUnlockable = (
  unlockableSnap,
  unlockable,
  unlockStateSnap,
  unlockState
) => {
  return (
    <label key={unlockableSnap.key}>
      <button
        type="button"
        disabled={
          unlockableSnap.cost > unlockStateSnap.money || unlockableSnap.enabled
        }
        onClick={() => {
          unlockable.enabled = true;
          unlockState.money -= unlockable.cost;
        }}
      >
        ${unlockableSnap.cost}
      </button>
      {" " + unlockableSnap.desc}
    </label>
  );
};

export default function AutomationUnlockPanel(props) {
  const unlockState = props.unlockState;
  const snap = useSnapshot(props.unlockState);

  const availableUnlockables = [];
  const purchasedUnlockables = [];
  for (let i = 0; i < snap.unlockables.length; i++) {
    const renderedUnlockable = renderUnlockable(
      snap.unlockables[i],
      unlockState.unlockables[i],
      snap,
      unlockState
    );
    if (snap.unlockables[i].enabled) {
      purchasedUnlockables.push(renderedUnlockable);
    } else if (snap.isAvailable(snap.unlockables[i])) {
      availableUnlockables.push(renderedUnlockable);
    }
  }

  return (
    <div className="right-panel">
      <label className="money"> ${snap.money}</label>
      <div className="right-panel">
        Upgrades:
        {availableUnlockables}
      </div>
      <br />
      <div className="right-panel">
        Purchased Upgrades:
        {purchasedUnlockables}
      </div>
    </div>
  );
}
