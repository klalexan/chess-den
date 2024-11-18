import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chessground } from 'chessground';
import { Role, Key, MoveMetadata, Piece } from 'chessground/types';
import { ChessGameService } from '../../services/chessgame.service';


@Component({
  selector: 'app-chessboard-editor',
  standalone: true,
  imports: [],
  templateUrl: './chessboard-editor.component.html',
  styleUrl: './chessboard-editor.component.scss'
})
export class ChessboardEditorComponent {

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
            // after: (from: string, to: string) => this.onMove(from, to)
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
          select: (key: Key) => {
            console.log('select' + key);
            const docStyle = document.getElementsByTagName('cg-board')[0] as HTMLElement;
            if (docStyle && docStyle.style.cursor && docStyle.style.cursor.includes('trash.cur')) {
              this.piece.emit({pieceSymbol: 'k',color: 'w', key: key as string});            
            }
          },
          change: () => {
            
          }
        },
        premovable: {
          enabled: true,
          showDests: true,
        },
        draggable: {
          enabled: true,
          showGhost: true,
          deleteOnDropOff: false,
        },
        drawable: {
          enabled: true,
          visible: true,
        },
        fen: this.fen
      });
    }
  }

  clearBoard(): void {
    this.board.clearBoard();
  }

  dragNewPiece(piece: Piece, event: Event): void {
    this.board.dragNewPiece(piece, event, true);
  }

  dragDropPiece({pieceSymbol, color, key}: {pieceSymbol: string, color: string, key: string}): void {
    // this.game.put({type: pieceSymbol as PieceSymbol, color: color as Color}, key as Square);
    // this.game.remove(key as Square);
    // this.fen = this.game.fen();
  }



}
