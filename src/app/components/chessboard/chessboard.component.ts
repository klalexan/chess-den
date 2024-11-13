import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChessPromotionDialogComponent } from '../chess-promotion-dialog/chess-promotion-dialog.component';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss'
})
export class ChessboardComponent implements OnChanges {
  promotionDialog = inject(MatDialog);
  board: any;
  @Input() fen: string = '';
  @Input() isBotPlaysAsWhite: boolean | null = false;
  @Output() move = new EventEmitter<string>();
  
  promotionPosition: { x: number, y: number } = { x: 0, y: 0 };


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
      this.board.set({ fen: this.fen });
      this.openPromotionDialog(move.color, move.to);
      return;
    }
    this.move.emit(move.san);
  }

  openPromotionDialog(color: string, dest: string): void {
    const dialog = this.promotionDialog.open(ChessPromotionDialogComponent, { 
      disableClose: true,
      autoFocus: true,
      data: { color }
    });

    dialog.afterClosed().subscribe((piece: string) => {
      const game = this.chessGame.loadGameFromFen(this.fen);
      this.move.emit(dest+'='+piece);
    }
  );  
  }

  getSquareCoordinates(square: string): { x: number, y: number } {
    const boardElement = document.getElementById('board');
  
    if (!boardElement) {
      return { x: 0, y: 0 }; // Default if board is not found
    }
  
    const boardSize = boardElement.offsetWidth;
    const squareSize = boardSize / 8;
  
    // Parse the square notation (e.g., 'e4' -> file 'e' and rank '4')
    const file = square[0];
    const rank = square[1];
  
    // Convert file to column index (0 for 'a', 7 for 'h')
    const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  
    // Convert rank to row index (0 for '8', 7 for '1' in standard chess notation)
    const rankIndex = 8 - parseInt(rank);
  
    // Calculate x and y position based on the square index
    const x = fileIndex * squareSize;
    const y = rankIndex * squareSize;
  
    return { x, y };
  }

  highlightInvalidMove(from: string, to: string): void {

    const map = new Map([[from, 'highlight'], [to, 'highlight']]);
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
