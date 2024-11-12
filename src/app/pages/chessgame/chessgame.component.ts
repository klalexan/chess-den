import { Component } from '@angular/core';
import { Chess } from 'chess.js';
import { CommonModule } from '@angular/common';
import { StockfishService } from '../../services/stockfish.service';
import { ChessGameService } from '../../services/chessgame.service';
import { ChessboardComponent } from "../../components/chessboard/chessboard.component";
import { AvailableMovesComponent } from "../../components/available-moves/available-moves.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chessgame',
  imports: [CommonModule, ChessboardComponent, AvailableMovesComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent {
  game: Chess;
  blindfoldMode: boolean = false;
  isBotPlaysAsWhite: boolean = true;
  fen: string;
  inputFEN = new FormControl('8/2k5/8/8/4P3/4K3/8/8 w - - 0 1');
  engineMove: string = '';

  constructor(
    private chessGame: ChessGameService,
    private stockfishService: StockfishService) {

      this.game = this.chessGame.newGame();
      this.fen = this.game.fen();
  }

  public createNewGame(): void {
    this.game = this.chessGame.newGame();

    if (this.isBotPlaysAsWhite) {
      this.chessGame.getBestMove(this.game.fen()).then(bestMove => {
        this.makeEngineMove(bestMove);
      });
    }
  }

  async loadGameFromFEN(): Promise<void> {
    if (this.inputFEN.value) {
      this.fen = this.inputFEN.value;
      this.game = this.chessGame.loadGameFromFen(this.fen);
      this.game.turn() === 'w' ? this.isBotPlaysAsWhite = true : this.isBotPlaysAsWhite = false;
      const isBotTurn = this.isBotPlaysAsWhite && this.game.turn() === 'w' || !this.isBotPlaysAsWhite && this.game.turn() === 'b';
      if (isBotTurn) {
        const bestMove = await this.chessGame.getBestMove(this.game.fen());
        if (bestMove) {
          this.makeEngineMove(bestMove);
        }
      }
    }
  }

  toggleBlindfold(): void {
    this.blindfoldMode = !this.blindfoldMode;
  }


  async onMove(fen: string): Promise<void> {
    this.game = this.chessGame.loadGameFromFen(fen);
    const bestMove = await this.chessGame.getBestMove(this.game.fen());
    console.log("Best Move from Stockfish:", bestMove);
    if (bestMove) {
      this.makeEngineMove(bestMove);
    }
  }

  makeEngineMove(bestMove: string) {
    const from = bestMove.slice(0, 2);
    const to = bestMove.slice(2, 4);
    const move = this.game.move({ from, to });
    this.engineMove = move.san;
    this.fen = this.game.fen();
  }

  ngOnDestroy(): void {
    this.chessGame.stop();
  }
}

