import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { CommonModule } from '@angular/common';
import { last } from 'rxjs';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss'
})
export class ChessboardComponent implements OnChanges {

  board: any;
  @Input() fen: string = '';
  @Input() isBotPlaysAsWhite: boolean | null = false;
  @Output() move = new EventEmitter<string>();
  
  isPromotion: boolean = false;
  promotionSquare: string = '';


  constructor(private chessGame: ChessGameService) {
  }

  initializeBoard(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        orientation: this.isBotPlaysAsWhite ? 'black' : 'white',
        highlight: {
          lastMove: false,
          check: true,
        },
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
      this.board.set({ fen: this.fen, orientation: this.isBotPlaysAsWhite ? 'black' : 'white', });
    } else {
      this.initializeBoard();
    }
  }

  onMove(from: string, to: string): void {
    const game = this.chessGame.loadGameFromFen(this.fen);
    const moves = game.moves({ verbose: true });
    const move = moves.find(m => m.from === from && m.to === to);

    if (!move) {
      this.board.set({ fen: this.fen });
      this.highlightInvalidMove(from, to);
      return;
    }

    if (move.promotion) {
      this.isPromotion = true;
      this.promotionSquare = to;
      return;
    }
    this.move.emit(move.san);
  }

  promotePawn(piece: string): void {
    const game = this.chessGame.loadGameFromFen(this.fen);
    game.move(this.promotionSquare+'='+piece);
    this.isPromotion = false;
    this.board.set({ fen: game.fen() });
    this.move.emit(game.fen());
  }

  highlightInvalidMove(from: string, to: string): void {

    const map = new Map([[from, 'square.highlight'], [to, 'square.invalid']]);
    this.board.set({
      highlight: {
        custom: map
      }
    });

    setTimeout(() => {
      this.board.set({ highlight: { lastMove: false, custom: new Map() } });
    }, 200);
  }

}
