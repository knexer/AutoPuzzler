import React from "react";
import { useSnapshot } from "valtio";

const display = (props, model) => {
  if (model.flagged) return "🚩";
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

const isInteractive = (props, model) => {
  if (props.gameWin || props.gameLose) return false;
  return !model.revealed && !model.flagged;
};

export default function Square(props) {
  const modelSnap = useSnapshot(props.model);
  return (
    <button
      className={
        "square" +
        (isInteractive(props, modelSnap)
          ? " unrevealed-square"
          : " revealed-square") +
        (modelSnap.automationFocus ? " automation-focus" : "")
      }
      onClick={props.onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onFlag(!props.model.flagged);
      }}
    >
      {display(props, modelSnap)}
    </button>
  );
}
