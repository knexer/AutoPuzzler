import React from "react";

export default class Square extends React.Component {
  handleClick() {
    if (
      this.props.data.revealed ||
      this.props.data.flagged ||
      this.props.locked
    )
      return;
    this.props.onClick();
  }

  handleFlag() {
    if (this.props.data.revealed || this.props.locked) return;
    this.props.onFlag(!this.props.data.flagged);
  }

  render() {
    const display = () => {
      if (this.props.data.revealed)
        return this.props.data.mine ? "🤯" : this.props.data.adjacentMines;
      if (this.props.data.flagged) return "🚩";
      return "";
    };

    return (
      <button
        className="square"
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
