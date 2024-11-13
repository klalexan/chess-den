import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { CommonModule } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
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
      this.board.set({ 
        drawable: {
          shapes: [
            {
              orig: 'a2',
              dest: 'a3',
              brush: 'green',
          }],
          autoShapes: [
            {
              orig: move.from,
              dest: move.to,
              brush: 'green',
          }]
        },
     });
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
      this.board.set({ 
        drawable: {
          autoShapes: []
        },
     });
      this.move.emit(dest+'='+piece);
    });  
  }

  highlightInvalidMove(from: string, to: string): void {
    
    this.board.set({ drawable: { autoShapes: [
      // {
      //   orig: from,
      //   dest: from,
      //   customSvg: {
      //     html: '<square cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />',
      //     center: 'dest',
      //   }
        
      // },
      // {
      //   orig: from,
      //   dest: to,
      //   customSvg: {
      //     html: '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />',
      //     center: 'dest',
      //   }
        
      // },

      {
        orig: from,
        dest: to,
        brush: 'red',
    }
    ] }});
    


    setTimeout(() => {
      this.board.set({ drawable: { autoShapes: [] }});
    }, 1000);
  }

}
