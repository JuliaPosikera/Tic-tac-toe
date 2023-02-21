import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  makeSquares() {
    let size = 0;
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(size));
        size++;
      }
      board.push(
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    }
    return board;
  }

  render() {
    return <div>{this.makeSquares()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: 0,
          row: 0,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      sortASC: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    //const moves = history.map((step, move) => {
    let historyArr;
    if (!this.state.sortASC) {
      historyArr = history.slice(0).reverse();
    } else {
      historyArr = history.slice(0);
    }

    const moves = historyArr.map((step, move) => {
      if (!this.state.sortASC) {
        move = historyArr.length - move;
        move--;
      }
      const desc = move
        ? `Go to move #${move}:Col ${step.col} Row ${step.row}`
        : "Go to game start";
      let selectedMove = "";
      if (this.state.stepNumber === move && history.length - 1 > move) {
        selectedMove = "selectedMove";
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={selectedMove}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      let isGameEnd = true;
      for (let i = 0; i < current.squares.length; i++) {
        if (current.squares[i] === null) {
          isGameEnd = false;
          break;
        }
      }
      isGameEnd
        ? (status = "Game End")
        : (status = "Next player: " + (this.state.xIsNext ? "X" : "O"));
    }
    let sortButton = "&darr;";
    if (this.state.sortASC) {
      sortButton = (
        <button onClick={() => this.changeSortButton()}>&darr;</button>
      );
    } else {
      sortButton = (
        <button onClick={() => this.changeSortButton()}>&uarr;</button>
      );
    }

    return (
      <div className="game">
        <div className="game-info">
          <div>
            {sortButton}
            {status}
          </div>
          <ol>{moves}</ol>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col = (i % 3) + 1;
    const row = Math.floor(i / 3) + 1;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (!squares[i]) {
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            row: row,
            col: col,
          },
        ]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  changeSortButton() {
    this.setState({
      sortASC: !this.state.sortASC,
    });
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
