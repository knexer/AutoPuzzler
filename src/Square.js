import React from "react";

export default class Square extends React.Component {
  handleClick() {
    this.props.onClick();
  }

  handleFlag() {
    this.props.onFlag(!this.props.data.flagged);
  }

  isInteractive = () => {
    if (this.props.gameWin || this.props.gameLose) return false;
    return !this.props.data.revealed && !this.props.data.flagged;
  };

  render() {
    const display = () => {
      if (this.props.data.flagged) return "🚩";
      if (this.props.data.mine) {
        if (this.props.data.revealed) return "🤯";
        if (this.props.gameWin) return "🚩";
        if (this.props.gameLose) return "💣";
      }

      if (this.props.data.revealed) {
        return (
          <span className={`adjacent-mines-${this.props.data.adjacentMines}`}>
            {this.props.data.adjacentMines}
          </span>
        );
      }
      return "";
    };

    return (
      <button
        className={
          "square" +
          (this.isInteractive() ? " unrevealed-square" : " revealed-square")
        }
        onClick={() => this.handleClick()}
        onContextMenu={(e) => {
          e.preventDefault();
          this.handleFlag();
        }}
      >
        {display()}
      </button>
    );
  }
}
