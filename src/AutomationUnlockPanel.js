import React from "react";
import { useSnapshot } from "valtio";

const renderUnlockable = (unlockableSnap, unlockable) => {
  return (
    <label key={unlockableSnap.key}>
      <input
        type="checkbox"
        checked={unlockableSnap.enabled}
        onChange={() => (unlockable.enabled = !unlockableSnap.enabled)}
      ></input>
      {" " + unlockableSnap.desc}
    </label>
  );
};

export default function AutomationUnlockPanel(props) {
  const unlockState = props.unlockState;
  const snap = useSnapshot(props.unlockState);

  const renderedUnlockables = [];
  for (let i = 0; i < snap.unlockables.length; i++) {
    renderedUnlockables.push(
      renderUnlockable(snap.unlockables[i], unlockState.unlockables[i])
    );
  }

  return (
    <div className="right-panel">
      <label className="money"> ${snap.money}</label>
      Upgrades:
      {renderedUnlockables}
    </div>
  );
}
