import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, effect, signal } from '@angular/core';
import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { Chess } from 'chess.js';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss'
})
export class ChessboardComponent implements OnChanges {

  board: any;
  @Input() fen: string = '';
  @Output() newFen = new EventEmitter<string>(); 

  constructor(private chessGame: ChessGameService) {
  }

  initializeBoard(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        orientation: 'white',
        movable: {
          events: {
            after: (from: string, to: string) => this.onMove(from, to)
          },
          color: 'both',
        },
        draggable: {
          enabled: true,
        },
        drawable: {
          enabled: true,
          visible: true,
        },
        fen: this.fen
      });
    }
  }

  ngOnChanges(): void {
    if (this.board) {
      this.board.set({ fen: this.fen });
    } else {
      this.initializeBoard();
    }
  }

  onMove(from: string, to: string): void {
    const game = this.chessGame.loadGameFromFen(this.fen);
    const move = this.chessGame.move(game, { from, to });
    if (move) {
      this.board.set({ fen: game.fen() });
      this.newFen.emit(game.fen());
    } else {
      this.board.set({ fen: this.fen });
      this.highlightInvalidMove(from, to);
    }
    
  
  }

  highlightInvalidMove(from: string, to: string): void {
    this.board.set({
      highlight: {
        squares: [from, to],
        color: 'red'  
      }
    });

    setTimeout(() => {
      this.board.set({ highlights: { squares: [] } });
    }, 1000);
  }

}
