import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ChessboardEditorComponent implements OnInit{

  board: any;
  @Output() fen = new EventEmitter<string>();
  // @Input() isBotPlaysAsWhite: boolean | null = false;
  // @Output() move = new EventEmitter<string>();
  // @Output() clear = new EventEmitter<string>();
  // @Output() piece = new EventEmitter<{pieceSymbol: string, color: string, key: string}>();
  FEN: string = '';
  constructor(private chessGame: ChessGameService) {
    
  }

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard(): void {
    const boardElement = document.getElementById('board-editor');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        events: {
          dropNewPiece: (piece: Piece, key: Key) => {
            const color = piece.color.charAt(0);
            let pieceSymbol = piece.role.charAt(0);
            if (piece.role === 'knight') {
              pieceSymbol = 'n';
            }
            // this.piece.emit({pieceSymbol, color,  key});
          },
          select: (key: Key) => {
            console.log('select' + key);
            const docStyle = document.getElementsByTagName('cg-board')[0] as HTMLElement;
            if (docStyle && docStyle.style.cursor && docStyle.style.cursor.includes('trash.cur')) {
              // this.piece.emit({pieceSymbol: 'k',color: 'w', key: key as string});            
            }
          },
          change: () => {
            
          }
        },
        // draggable: {
        //   enabled: true,
        //   showGhost: true,
        //   deleteOnDropOff: false,
        // },
        // drawable: {
        //   enabled: true,
        //   visible: true,
        // },
        fen: this.FEN
      });
    }
  }

  start(): void {
    this.fen.emit(this.board.getFen() + ' w - - 0 1');
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
