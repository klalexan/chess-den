import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';

import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { CommonModule } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { ChessPromotionDialogComponent } from '../chess-promotion-dialog/chess-promotion-dialog.component';
import { Key, MoveMetadata, Piece, Role } from 'chessground/types';

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
  @Output() clear = new EventEmitter<string>();
  @Output() piece = new EventEmitter<{pieceSymbol: string, color: string, key: string}>();

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
          afterNewPiece: (role: Role, key: Key, metadata: MoveMetadata) => {
            console.log('dropNewPiece', role, key);
          },
          color: 'both',
          showDests: true,
        },
        events: {
          dropNewPiece: (piece: Piece, key: Key) => {
            const color = piece.color.charAt(0);
            let pieceSymbol = piece.role.charAt(0);
            if (piece.role === 'knight') {
              pieceSymbol = 'n';
            }
            this.piece.emit({pieceSymbol, color,  key});
          },
        },
        premovable: {
          enabled: true,
          showDests: true,
        },
        draggable: {
          enabled: true,
          showGhost: true,
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
      {
        orig: from,
        dest: to,
        customSvg: {
          html: '<svg width="80" height="80" \
          viewBox="0 0 24 24" fill="#882020" stroke="#882020" \
          stroke-width="3" opacity="0.7" \
          stroke-linecap="round" stroke-linejoin="round">\
          <line x1="7" y1="7" x2="20" y2="20" />\
          <line x1="20" y1="4" x2="4" y2="20" /></svg>',
          center: 'dest',
        }
        
      },

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

  dragNewPiece(piece: Piece, event: Event): void {
    this.board.dragNewPiece(piece, event, true);
  }

}
