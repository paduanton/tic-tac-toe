import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area',
  template: `
    <section>
      <div *ngIf="winner === 'X' || winner === 'O'" id="winnerArea" class="winner">
        Winner: <span>{{ winner }}</span>
      </div>
      <div id="statusArea" class="status">
        Next player: <span>{{ currentPlayer }}</span>
      </div>
    </section>
    <section>
      <button (click)="newGame()">Reset</button>
    </section>
    <section id="gaming-section">
      <ol>
        <li class="row" *ngFor="let row of rows">
          <button 
            class="square" 
            (click)="selectSquare(row, column)" 
            *ngFor="let column of columns">
            
            <span *ngIf="xPlayerHasBeenClickedSquare(row, column)">X</span>
            <span *ngIf="oPlayerHasBeenClickedSquare(row, column)">O</span>
            <span 
            *ngIf="!oPlayerHasBeenClickedSquare(row, column)
             && !xPlayerHasBeenClickedSquare(row, column)"
            >
            -
            </span>
          </button>
        </li>
      </ol>
    </section>
  `,
  styles: [
    `#gaming-section {
      margin-top: 15px;
    }
    `,
    `ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    `,
    `li {
        margin: 0;
        padding: 0;
    }
    `,
    `.square {
      width: 40px;
      height: 40px;
      margin: 2px;
    }
    `,
  ]
})

export class MainAppComponent implements OnInit {
  rows: [number, number, number] = [1, 2, 3];
  columns: [number, number, number] = [1, 2, 3];

  oPlayer: {
    isWinner: boolean;
    optionsChoosed: {
      row: number;
      column: number
    }[];
  };

  xPlayer: {
    isWinner: boolean;
    optionsChoosed: {
      row: number;
      column: number;
    }[];
  };

  defaultPossibleOptions = [
    [{ row: 1, column: 1 }, { row: 1, column: 2 }, { row: 1, column: 3 }],
    [{ row: 2, column: 1 }, { row: 2, column: 2 }, { row: 2, column: 3 }],
    [{ row: 3, column: 1 }, { row: 3, column: 2 }, { row: 3, column: 3 }],
    [{ column: 1, row: 1 }, { column: 1, row: 2 }, { column: 1, row: 3 }],
    [{ column: 2, row: 1 }, { column: 2, row: 2 }, { column: 2, row: 3 }],
    [{ column: 3, row: 1 }, { column: 3, row: 2 }, { column: 3, row: 3 }],
  ];

  diagonalPossibleSuccessOptions = {
    firstOption: [{ row: 1, column: 1 }, { row: 2, column: 2 }, { row: 3, column: 3 }],
    secondOption: [{ row: 1, column: 3 }, { row: 2, column: 2 }, { row: 3, column: 1 }],
  };

  currentPlayer: 'X' | 'O';

  ngOnInit() {
    this.newGame();
  }

  get winner() {
    if (this.xPlayer.isWinner) {
      return 'X';
    } else if (this.oPlayer.isWinner) {
      return 'O';
    } else {
      return '...';
    }
  }

  newGame = () => {
    this.currentPlayer = 'X';
    this.oPlayer = {
      isWinner: false,
      optionsChoosed: [],
    };
    this.xPlayer = {
      isWinner: false,
      optionsChoosed: [],
    };
  }

  selectSquare(row: number, column: number): void {
    if (!this.squareHasBeenClicked(row, column)
      && !this.xPlayer.isWinner
      && !this.oPlayer.isWinner) {

      if (this.currentPlayer === 'X') {
        this.xPlayer.optionsChoosed.push({ row, column });

        if (this.hasPlayerWon(this.currentPlayer)) {
          this.xPlayer.isWinner = true
        } else {
          this.currentPlayer = 'O';
        }
      } else {
        this.oPlayer.optionsChoosed.push({ row, column });

        if (this.hasPlayerWon(this.currentPlayer)) {
          this.oPlayer.isWinner = true
        } else {
          this.currentPlayer = 'X';
        }
      }
    }
  }

  hasPlayerWon(player: 'X' | 'O'): boolean {
    if (this.matchedDiagonalOptions(player) || this.matchedDefaultOptions(player)) {
      return true;
    }
    return false;
  }

  xPlayerHasBeenClickedSquare(row: number, column: number): boolean {
    return !!this.xPlayer.optionsChoosed.find((option) => {
      return (option.row === row && option.column === column)
    });
  }

  oPlayerHasBeenClickedSquare(row: number, column: number): boolean {
    return !!this.oPlayer.optionsChoosed.find((option) => {
      return (option.row === row && option.column === column)
    });
  }

  squareHasBeenClicked(row: number, column: number): boolean {
    const oPlayerClicked = this.oPlayerHasBeenClickedSquare(row, column);
    const xPlayerClicked = this.xPlayerHasBeenClickedSquare(row, column);

    if (oPlayerClicked || xPlayerClicked) {
      return true;
    }

    return false;
  }

  matchedDefaultOptions(player: 'X' | 'O'): boolean {
    const matchedDefaultOption: boolean = this.defaultPossibleOptions.some((option) => {
      let matchesCounter: number = 0;

      return option.some((square) => {
        if (player === 'X') {
          if (this.xPlayerHasBeenClickedSquare(square.row, square.column)) {
            matchesCounter++;
          }
        } else {
          if (this.oPlayerHasBeenClickedSquare(square.row, square.column)) {
            matchesCounter++;
          }
        }

        if (matchesCounter === 3) {
          return true;
        } else {
          return false
        }
      });
    });

    return matchedDefaultOption;
  }

  matchedDiagonalOptions(player: 'X' | 'O'): boolean {
    const firstDiagonalPossibleOption = this.diagonalPossibleSuccessOptions.firstOption;
    const secondDiagonalPossibleOption = this.diagonalPossibleSuccessOptions.secondOption;

    let matchesCounter: number = 0;

    firstDiagonalPossibleOption.forEach((option) => {
      if (player === 'X') {
        if (this.xPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      } else {
        if (this.oPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      }
    });

    if (matchesCounter === 3) {
      return true;
    }

    matchesCounter = 0;

    secondDiagonalPossibleOption.forEach((option) => {
      if (player === 'X') {
        if (this.xPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      } else {
        if (this.oPlayerHasBeenClickedSquare(option.row, option.column)) {
          matchesCounter++;
        }
      }
    });

    if (matchesCounter === 3) {
      return true;
    }

    return false;
  }
}
