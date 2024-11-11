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
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent implements OnInit {
  game: Chess;
  // status: BehaviorSubject<Status> = new BehaviorSubject<Status>(Status.white);
  board: any;
  availableMoves = new BehaviorSubject<string[]>([]);
  blindfoldMode: boolean = false;
  isStockfishPlayAsWhite: boolean = true;

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
        fen: this.game.fen()
      });
    }
  }

      // Create game on Lichess
  public createNewGame(): void {
    this.game = this.chessGame.newGame();

    if (this.isStockfishPlayAsWhite) {
      this.stockfishService.getBestMove(this.game.fen()).then(bestMove => {
        this.makeEngineMove(bestMove);
      });
    }
  }

    // Retrieve available moves from Chess.js and update the array
    updateAvailableMoves(): void {
      this.availableMoves.next(this.game.moves()); // Retrieve all legal moves
    }

    toggleBlindfold(): void {
      this.blindfoldMode = !this.blindfoldMode;
      this.board?.set({
        viewOnly: this.blindfoldMode,
        movable: { color: this.blindfoldMode ? 'none' : 'both' }
      });
    }


    async onMove(from: string, to: string) {
      const move = this.chessGame.move(this.game, { from, to });
      if (!move) {
        // Move is invalid, show an error or reset the board state
        this.highlightInvalidMove(from, to);
        console.log("Invalid move:", from, to);
        this.board.set({ fen: this.game.fen() }); // Reset to the previous valid position
        // Highlight the invalid move attempt
        
        
        return;
      }
      
      const bestMove = await this.stockfishService.getBestMove(this.game.fen());
      console.log("Best Move from Stockfish:", bestMove);
      if (bestMove) {
        this.makeEngineMove(bestMove);
      }
    }

    makeEngineMove(bestMove: string) {
      const from = bestMove.slice(0, 2);
      const to = bestMove.slice(2, 4);
      this.game.move({ from, to });
      this.board.set({ fen: this.game.fen() });
      this.updateAvailableMoves();
    }

    // Handle move when clicked from available moves list
  async onMoveClick(move: string): Promise<void> {
    const moveObj = this.game.move(move); // Make the selected move
    if (moveObj) {
      this.board?.set({ fen: this.game.fen() });
      this.updateAvailableMoves(); // Refresh available moves
      const bestMove = await this.stockfishService.getBestMove(this.game.fen());
      console.log("Best Move from Stockfish:", bestMove);
      if (bestMove) {
        this.makeEngineMove(bestMove);
      }
    }
  }

    // Highlight invalid move attempt
  highlightInvalidMove(from: string, to: string): void {
    this.board.set({
      highlight: {
        squares: [from, to],
        color: 'red'  // Red color for invalid moves
      }
    });

    // Remove the highlights after 1 second (adjust as needed)
    setTimeout(() => {
      this.board.set({ highlights: { squares: [] } });
    }, 1000);
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

