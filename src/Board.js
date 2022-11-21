import React from "react";
import Square from "./Square.js";

function* adjacentSquares(squareData, x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    const newY = y + dy;
    if (newY < 0 || newY >= squareData.length) continue;

    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;
      if (newX < 0 || newX >= squareData[y].length) continue;

      yield { square: squareData[newY][newX], x: newX, y: newY };
    }
  }
}

function makeSquareData(
  width,
  height,
  mines,
  startWithRevealedSquare,
  startWithRevealedZero
) {
  const makeSquareDatum = () => {
    return { mine: false, revealed: false, flagged: false, adjacentMines: 0 };
  };

  const squareData = Array.from({ length: height }, () =>
    Array.from({ length: width }, makeSquareDatum)
  );

  const addMine = (x, y) => {
    if (squareData[y][x].mine) return false;
    squareData[y][x].mine = true;

    for (const adjSquare of adjacentSquares(squareData, x, y)) {
      adjSquare.square.adjacentMines++;
    }

    return true;
  };

  for (let i = 0; i < mines; i++) {
    let attempts = 0;
    while (attempts < 10) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (addMine(x, y)) break;
      attempts++;
    }
  }
  while (startWithRevealedZero || startWithRevealedSquare) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (!squareData[y][x].mine) {
      if (startWithRevealedZero) {
        if (squareData[y][x].adjacentMines === 0) {
          squareData[y][x].revealed = true;
          break;
        }
        continue;
      }
      squareData[y][x].revealed = true;
      break;
    }
  }

  return squareData;
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squareData: makeSquareData(
        props.width,
        props.height,
        props.mines,
        props.startWithRevealedSquare,
        props.startWithRevealedZero
      ),
      gameWin: false,
      gameLose: false,
      intervalId: 0,
    };
  }

  componentDidMount() {
    this.setState({
      intervalId: setInterval(
        this.handleInterval.bind(this),
        this.props.autoClickIntervalMs
      ),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidUpdate() {
    if (
      this.numRevealedSpaces() + this.numFlaggedSpaces() ===
        this.props.width * this.props.height &&
      this.numFlaggedSpaces() === this.props.mines &&
      !this.state.gameWin &&
      !this.state.gameLose
    ) {
      this.setState({ gameWin: true });
    }
  }

  handleInterval() {
    // let's simulate a left and right click on every revealed square.
    for (const { square, x, y } of this.allSpaces()) {
      if (square.revealed) {
        if (this.props.autoClick) this.handleClick(x, y);
        if (this.props.autoRightClick) this.handleFlag(x, y);
      }
    }
  }

  numFlaggedSpaces() {
    let flaggedSpaces = 0;
    for (const { square } of this.allSpaces()) {
      if (square.flagged) {
        flaggedSpaces++;
      }
    }

    return flaggedSpaces;
  }

  numRevealedSpaces() {
    let revealedSpaces = 0;
    for (const { square } of this.allSpaces()) {
      if (square.revealed) {
        revealedSpaces++;
      }
    }

    return revealedSpaces;
  }

  allSpaces = function* () {
    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        yield { square: this.state.squareData[y][x], x: x, y: y };
      }
    }
  };

  updateSquare(x, y, squareDatum) {
    this.setState((prevState) => ({
      squareData: prevState.squareData.map((row, i) =>
        i !== y
          ? row
          : row.map((square, j) =>
              j !== x ? square : { ...square, ...squareDatum }
            )
      ),
    }));
  }

  revealSquare(x, y) {
    const squareDatum = this.state.squareData[y][x];
    if (squareDatum.revealed) return;
    if (squareDatum.flagged) return;

    this.updateSquare(x, y, { revealed: true });

    if (squareDatum.mine) {
      this.setState({ gameLose: true });
    }
  }

  revealAdjacentSquares(x, y) {
    for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
      this.revealSquare(adjSquare.x, adjSquare.y);
    }
  }

  safeRevealAdjacentSquares(x, y) {
    let adjacentFlagged = 0;
    for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
      if (adjSquare.square.flagged) adjacentFlagged++;
    }
    if (adjacentFlagged >= this.state.squareData[y][x].adjacentMines) {
      this.revealAdjacentSquares(x, y);
    }
  }

  handleClick(x, y) {
    const squareDatum = this.state.squareData[y][x];
    if (this.state.gameLose || this.state.gameWin || squareDatum.flagged) {
      return;
    }

    if (squareDatum.revealed) {
      if (this.props.safeAutoReveal >= squareDatum.adjacentMines) {
        this.safeRevealAdjacentSquares(x, y);
      } else if (this.props.autoReveal >= squareDatum.adjacentMines) {
        this.revealAdjacentSquares(x, y);
      }
    }

    this.revealSquare(x, y);
  }

  flagSquare(x, y, flagged) {
    if (this.state.squareData[y][x].revealed) return;
    if (this.state.squareData[y][x].flagged === flagged) return;

    this.updateSquare(x, y, { flagged: flagged });
  }

  flagAdjacentSquares(x, y) {
    for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
      this.flagSquare(adjSquare.x, adjSquare.y, true);
    }
  }

  safeFlagAdjacentSquares(x, y) {
    let adjFlaggable = 0;
    for (const adjSquare of adjacentSquares(this.state.squareData, x, y)) {
      if (adjSquare.square.flagged || !adjSquare.square.revealed) {
        adjFlaggable++;
      }
    }
    if (adjFlaggable === this.state.squareData[y][x].adjacentMines) {
      this.flagAdjacentSquares(x, y);
    }
  }

  handleFlag(x, y, flagged) {
    if (this.state.gameLose || this.state.gameWin) {
      return;
    }

    if (this.state.squareData[y][x].revealed) {
      if (this.props.safeAutoFlag) {
        this.safeFlagAdjacentSquares(x, y);
      } else if (this.props.autoFlag) {
        this.flagAdjacentSquares(x, y);
      }
    } else {
      this.flagSquare(x, y, flagged);
    }
  }

  renderSquare(x, y) {
    return (
      <Square
        key={y * this.props.width + x}
        onClick={() => this.handleClick(x, y)}
        onFlag={(flagged) => this.handleFlag(x, y, flagged)}
        gameWin={this.state.gameWin}
        gameLose={this.state.gameLose}
        data={this.state.squareData[y][x]}
      />
    );
  }

  renderRow(y) {
    return (
      <div className="board-row" key={y}>
        {Array.from({ length: this.props.width }, (step, i) =>
          this.renderSquare(i, y)
        )}
      </div>
    );
  }

  render() {
    const status = () => {
      if (this.state.gameLose) return "Mine located the hard way - you lose!";
      if (this.state.gameWin) return "All mines flagged - you win!";
      return `Flagged ${this.numFlaggedSpaces()} of ${this.props.mines} mines.`;
    };

    return (
      <div>
        <div className="status">{status()}</div>
        {Array.from({ length: this.props.height }, (element, i) =>
          this.renderRow(i)
        )}
      </div>
    );
  }
}
