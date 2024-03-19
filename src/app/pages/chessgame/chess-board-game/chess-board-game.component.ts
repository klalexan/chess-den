import { Component, OnInit } from '@angular/core';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import {Key, Piece, Role} from 'chessground/types';

@Component({
  selector: 'app-chess-board-game',
  standalone: true,
  imports: [],
  templateUrl: './chess-board-game.component.html',
  styleUrl: './chess-board-game.component.scss'
})
export class ChessBoardGameComponent implements OnInit {

  board: any;

  ngOnInit(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        
        turnColor: 'white',
        movable: {
          events: {
            after: (orig: string, dest: string, metadata: any) => {
              console.log('after', orig, dest, metadata);
            },
            afterNewPiece: (role: Role, key: Key, metadata: any) => {
              console.log('afterNewPiece', role, key, metadata);
            }
          },
          color: 'both',
        },
        events: {
          move: (orig:string, dest:string) => {
            // this.makeHumanMove(orig+dest, false);
          },
          dropNewPiece: (piece: Piece, key: Key) => {
            console.log('dropNewPiece', piece, key);
          },
          select: (key: string) => {
            console.log('select', key);
          },
          insert: (elements: any) => {
            console.log('insert', elements);
          },
          change: () => {
            //this.fen.setValue(this.board.getFen() + ' w - - 0 1');
            console.log(this.board.getFen());
          }
        },
        draggable: {
          enabled: true,
        },
        drawable: {
          enabled: true,
          visible: true,
        }
      });
    }
  }

}
