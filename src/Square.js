import React from "react";

export default class Square extends React.Component {
  handleClick() {
    this.props.onClick();
  }

  handleFlag() {
    this.props.onFlag(!this.props.data.flagged);
  }

  render() {
    const display = () => {
      if (this.props.data.revealed && this.props.data.mine) return "🤯";
      if (this.props.data.revealed) {
        return (
          <span className={`adjacent-mines-${this.props.data.adjacentMines}`}>
            {this.props.data.adjacentMines}
          </span>
        );
      }
      if (this.props.data.flagged) return "🚩";
      return "";
    };

    return (
      <button
        className={
          "square" +
          (this.props.data.revealed || this.props.data.flagged
            ? " revealed-square"
            : " unrevealed-square")
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
