import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width': '60px',
  'height': '60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

function Square({ children }) {
  return (
    <div
      className="square"
      style={squareStyle}>
      { children}
    </div>
  );
}

function Board() {
  const [winner, setWinner] = useState('');
  const [nextPlayer, setNextPlayer] = useState('X');
  const [oPlayer, setOPlayer] = useState({
    optionsChoosed: []
  });
  const [xPlayer, setXPlayer] = useState({
    optionsChoosed: []
  });
  const [defaultPossibleSuccessfulOptions, setDefaultPossibleSuccessfulOptions] = useState(
    [
      [{ row: 1, column: 1 }, { row: 1, column: 2 }, { row: 1, column: 3 }],
      [{ row: 2, column: 1 }, { row: 2, column: 2 }, { row: 2, column: 3 }],
      [{ row: 3, column: 1 }, { row: 3, column: 2 }, { row: 3, column: 3 }],
      [{ column: 1, row: 1 }, { column: 1, row: 2 }, { column: 1, row: 3 }],
      [{ column: 2, row: 1 }, { column: 2, row: 2 }, { column: 2, row: 3 }],
      [{ column: 3, row: 1 }, { column: 3, row: 2 }, { column: 3, row: 3 }],
    ]
  );
  const [diagonalPossibleSuccessfulOptions, setDiagonalPossibleSuccessfulOptions] = useState(
    {
      firstOption: [{ row: 1, column: 1 }, { row: 2, column: 2 }, { row: 3, column: 3 }],
      secondOption: [{ row: 1, column: 3 }, { row: 2, column: 2 }, { row: 3, column: 1 }]
    }
  );
  const [rows, setRows] = useState([1, 2, 3]);
  const [columns, setColumns] = useState([1, 2, 3]);

  function newGame() {
    setWinner('');
    setNextPlayer('X');
    setOPlayer({
      optionsChoosed: []
    })
    setXPlayer({
      optionsChoosed: []
    })
  }

  function xPlayerHasBeenClickedSquare(row, column) {
    return !!xPlayer.optionsChoosed.find((option) => {
      return (option.row === row && option.column === column)
    });
  }

  function oPlayerHasBeenClickedSquare(row, column) {
    return !!oPlayer.optionsChoosed.find((option) => {
      return (option.row === row && option.column === column)
    });
  }

  function squareHasBeenClicked(row, column) {
    const xPlayerClicked = xPlayerHasBeenClickedSquare(row, column);
    const oPlayerClicked = oPlayerHasBeenClickedSquare(row, column);

    if (oPlayerClicked || xPlayerClicked) {
      return true;
    }

    return false;
  }

  function matchedDefaultSuccessfulOptions(player) {
    const matchedDefaultSuccessfulOption = defaultPossibleSuccessfulOptions.some((option) => {
      let matchesCounter = 0;

      return option.some((square) => {
        if (player === 'X') {
          if (xPlayerHasBeenClickedSquare(square.row, square.column)) {
            matchesCounter++;
          }
        } else if (player === 'O') {
          if (oPlayerHasBeenClickedSquare(square.row, square.column)) {
            matchesCounter++;
          }
        }

        if (matchesCounter === 3) {
          return true;
        }

        return false;
      })
    })

    return matchedDefaultSuccessfulOption;
  }

  function matchedDiagonalSuccessfulOptions(player) {
    const firstDiagonalSuccesfulOption = diagonalPossibleSuccessfulOptions.firstOption;
    const secondDiagonalSuccesfulOption = diagonalPossibleSuccessfulOptions.secondOption;

    let matchesCounter = 0;

    firstDiagonalSuccesfulOption.forEach((option) => {
      if (player === 'X') {
        if (xPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      } else if (player === 'O') {
        if (oPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      }
    });

    if (matchesCounter === 3) {
      return true;
    }

    matchesCounter = 0;

    secondDiagonalSuccesfulOption.forEach((option) => {
      if (player === 'X') {
        if (xPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      } else if (player === 'O') {
        if (oPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      }
    });

    if (matchesCounter === 3) {
      return true;
    }

    return false;
  }

  function hasPlayerWon(player) {
    if (matchedDefaultSuccessfulOptions(player) || matchedDiagonalSuccessfulOptions(player)) {
      return true;
    }

    return false;
  }

  function clickSquare(row, column) {
    if (!squareHasBeenClicked(row, column) && winner !== 'X' && winner !== 'O') {
      if (nextPlayer === 'X') {
        const xPlayerOtionsChoosed = [...xPlayer.optionsChoosed]

        xPlayerOtionsChoosed.push({ row, column });

        setXPlayer({
          optionsChoosed: xPlayerOtionsChoosed
        });

        if (!hasPlayerWon(nextPlayer)) {
          setNextPlayer('O');
        }
      } else if (nextPlayer === 'O') {
        const oPlayerOtionsChoosed = [...oPlayer.optionsChoosed]

        oPlayerOtionsChoosed.push({ row, column });

        setOPlayer({
          optionsChoosed: oPlayerOtionsChoosed
        });

        if (!hasPlayerWon(nextPlayer)) {
          setNextPlayer('X');
        }
      }
    }
  }

  useEffect(() => {
    if (hasPlayerWon('X')) {
      setWinner('X');
    } else if (hasPlayerWon('O')) {
      setWinner('O');
    }
  },
    [oPlayer, xPlayer]
  );
  return (
    <div style={containerStyle} className="gameBoard">
      {
        winner ?
          <div
            id="winnerArea"
            className="winner"
            style={instructionsStyle}>
            Winner: <span>{winner}</span>
          </div>
          : <div
            id="statusArea"
            className="status"
            style={instructionsStyle}>
            Next player: <span>{nextPlayer}</span>
          </div>
      }
      <button style={buttonStyle} onClick={() => newGame()}>Reset</button>
      <div style={boardStyle}>
        {
          rows && rows.map((row) => {
            return <div key={`row-${row}`} className="board-row" style={rowStyle}>
              {
                columns && columns.map((column) => {
                  return <Square key={`column-${column}`}>
                    <div style={{
                      width: 'inherit',
                      height: 'inherit',
                      display: 'inherit',
                      justifyContent: 'inherit',
                      alignItems: 'inherit',
                      cursor: 'pointer'
                    }}
                      onClick={() => clickSquare(row, column)}>
                      {xPlayerHasBeenClickedSquare(row, column) && 'X'}
                      {oPlayerHasBeenClickedSquare(row, column) && 'O'}
                      {
                        (!xPlayerHasBeenClickedSquare(row, column)
                          && !oPlayerHasBeenClickedSquare(row, column)) && '-'}
                    </div>
                  </Square>
                })
              }
            </div>
          })
        }
      </div>
    </div >
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);
