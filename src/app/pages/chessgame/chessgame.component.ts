import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, effect, signal } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { Chess } from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import { Status } from '../../models/chess/status.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import {Key, Piece, Role} from 'chessground/types';
import { StockfishService } from '../../services/stockfish.service';
import { ChessGameService } from '../../services/chessgame.service';

@Component({
  selector: 'app-chessgame',
  imports: [ReactiveFormsModule, CommonModule, MatExpansionModule],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent implements OnInit {
  game: Chess;
  // status: BehaviorSubject<Status> = new BehaviorSubject<Status>(Status.white);
  board: any;
  // availableMoves = new BehaviorSubject<string[]>([]);
  // fen = '8/2k5/8/8/4P3/4K3/8/8 w - - 0 1';
  // engineMove =  signal('');
  private isPlayerMove = true;


  constructor(
    private chessGame: ChessGameService,
    private stockfishService: StockfishService) {

    this.game = this.chessGame.newGame();
   }

  ngOnInit(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        movable: {
          events: {
            after: this.onMove.bind(this)
          },
          color: 'both',
        },
        // events: {
        //   change: () => {
        //     this.fen.setValue(this.board.getFen() + ' w - - 0 1');
        //     console.log(this.board.getFen());
        //   }
        // },
        draggable: {
          enabled: true,
        },
        drawable: {
          enabled: true,
          visible: true,
        },
        fen: this.game.fen()
      });
    }
      // this.status.subscribe((status: Status) => {
      //   switch (status) {
      //     case Status.white:
      //       this.availableMoves.next(this.chess.moves());
      //       break;
      //     case Status.black:
      //       this.makeMove();
      //       break;
      //     case Status.draw:
      //       this.drawGame();
      //       break;
      //     case Status.stalemate:
      //       this.drawGame();
      //       break;
      //     case Status.checkmate:
      //       this.endGame();
      //       break;
      //   }
      // });
    }



    async onMove(from: string, to: string) {
      console.log('onmove');
              if (!this.isPlayerMove) return; // Skip if it’s the engine’s move
      this.isPlayerMove = false;
      const move = this.game.move({ from, to });
      if (move) {
        console.log("Player Move:", from, to);
      console.log("Current FEN:", this.game.fen());
      const bestMove = await this.stockfishService.getBestMove(this.game.fen());
      console.log("Best Move from Stockfish:", bestMove);
      if (bestMove) {
        this.makeEngineMove(bestMove);
      }
      }
      this.isPlayerMove = true;
    }

    makeEngineMove(bestMove: string) {
      this.isPlayerMove = false;
      const from = bestMove.slice(0, 2);
      const to = bestMove.slice(2, 4);
      const move = this.game.move({ from, to });
      console.log("Current FEN:", this.game.fen());
      if (move) {
        this.board.set({ fen: this.game.fen() });
      }
      this.isPlayerMove = true;
    }

    // ngOnDestroy(): void {
    //   this.stockfishService.stop();
    // }

  // public setBoard(): void {
  //   this.board.set({fen: this.game.fen()});
    
  // }

  // makeHumanMove(move: string, effect: boolean): void {
  //   if (this.engine.humanMove(this.chess, move)) {
  //     if (effect) {
  //       this.setBoard();
  //     }
  //     if (this.engine.isGameOver(this.chess)) {
  //       this.status.next(Status.checkmate);
  //     } else {
  //       this.status.next( Status.black);
  //     }
  //   }
  // }

  // public makeMove(): void {
  //   this.engine.getBestMove(this.game).then((bestMove: string) => {
  //     if (bestMove) {
  //       console.log(bestMove);
  //       const from = bestMove.substring(0,2);
  //       const to = bestMove.substring(2,4);
  //       const promotion = bestMove.length === 5 ? bestMove.substring(4,5): '';
  //       const moves = this.game.moves({ verbose: true });
  //       for (const move of moves) {
  //         if (move.from === from && move.to === to) {
  //           this.engineMove.set(move.san);
  //         }
  //       }
  //       this.engine.move(this.game, from, to, promotion);
  //       this.setBoard();
  //       if (this.engine.isGameOver(this.game)) {
  //         this.status.next(Status.checkmate);
  //       } else {
  //         this.status.next(Status.white);
  //       }
  //     }
  //   });
  // }

  // public endGame(): void {
  //   console.log(this.game.history());
  //   console.log(this.game.pgn());
  // }

  // public drawGame(): void {
  //   console.log('Game drawn');
  // }

  // public undo(): void {
  //   this.engine.undo(this.game);
  //   if (this.engine.turn(this.game) === 'b') {
  //     this.engine.undo(this.game);
  //   }
  //   this.setBoard();
  // }

  // startNewGame(): void {
  //   this.chess = this.engine.getChessInstance();
  //   console.log(this.board.getFen());
  //   if (this.fen.value) {
  //     this.chess.load(this.fen.value);
  //     this.status.next(Status.white);
  //   }
  //   this.setBoard();
  // }

  // dragNewPiece(piece: Piece, event: Event): void {
  //   this.board.dragNewPiece(piece, event);
  // }
}

