import React from "react";
import { useSnapshot } from "valtio";

const display = (props, model) => {
  if (model.flagged) {
    if (props.gameLose && !model.mine) return "⚠️";
    return "🚩";
  }
  if (model.mine) {
    if (model.revealed) return "🤯";
    if (props.gameWin) return "🚩";
    if (props.gameLose) return "💣";
  }

  if (model.revealed) {
    return (
      <span className={`adjacent-mines-${model.adjacentMines}`}>
        {model.adjacentMines}
      </span>
    );
  }
  return "";
};

const isInteractive = (props) => {
  return !props.gameWin && !props.gameLose;
};

export default function Square(props) {
  const modelSnap = useSnapshot(props.model);
  const interactive = isInteractive(props, modelSnap);
  const highlight = interactive && !modelSnap.revealed && !modelSnap.flagged;
  return (
    <button
      className={
        "square" +
        (highlight ? " unrevealed-square" : " revealed-square") +
        (modelSnap.automationFocus ? " automation-focus" : "")
      }
      onClick={interactive ? props.onClick : undefined}
      onContextMenu={(e) => {
        e.preventDefault();
        interactive && props.onFlag(!props.model.flagged);
      }}
    >
      {display(props, modelSnap)}
    </button>
  );
}
