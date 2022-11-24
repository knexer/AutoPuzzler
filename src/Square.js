import React from "react";

const display = (props) => {
  if (props.data.flagged) return "🚩";
  if (props.data.mine) {
    if (props.data.revealed) return "🤯";
    if (props.gameWin) return "🚩";
    if (props.gameLose) return "💣";
  }

  if (props.data.revealed) {
    return (
      <span className={`adjacent-mines-${props.data.adjacentMines}`}>
        {props.data.adjacentMines}
      </span>
    );
  }
  return "";
};

const isInteractive = (props) => {
  if (props.gameWin || props.gameLose) return false;
  return !props.data.revealed && !props.data.flagged;
};

export default function Square(props) {
  return (
    <button
      className={
        "square" +
        (isInteractive(props) ? " unrevealed-square" : " revealed-square")
      }
      onClick={props.onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onFlag(props.data.flagged);
      }}
    >
      {display(props)}
    </button>
  );
}
