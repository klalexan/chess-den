import { Component } from '@angular/core';
import { Chess } from 'chess.js';
import { CommonModule } from '@angular/common';
import { StockfishService } from '../../services/stockfish.service';
import { ChessGameService } from '../../services/chessgame.service';
import { ChessboardComponent } from "../../components/chessboard/chessboard.component";
import { AvailableMovesComponent } from "../../components/available-moves/available-moves.component";

@Component({
  selector: 'app-chessgame',
  imports: [CommonModule, ChessboardComponent, AvailableMovesComponent],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent {
  game: Chess;
  availableMoves: string[];
  blindfoldMode: boolean = false;
  isBotPlaysAsWhite: boolean = true;
  fen: string;
  engineMove: string = '';

  constructor(
    private chessGame: ChessGameService,
    private stockfishService: StockfishService) {

      this.game = this.chessGame.newGame();
      this.availableMoves = this.game.moves();
      this.fen = this.game.fen();
   }

  ngOnInit(): void {
    
  }

      // Create game on Lichess
  public createNewGame(): void {
    this.game = this.chessGame.newGame();

    if (this.isBotPlaysAsWhite) {
      this.chessGame.getBestMove(this.game.fen()).then(bestMove => {
        this.makeEngineMove(bestMove);
      });
    }
  }

  toggleBlindfold(): void {
    this.blindfoldMode = !this.blindfoldMode;
  }


  async onMove(fen: string): Promise<void> {
    this.game = this.chessGame.loadGameFromFen(fen);
    const bestMove = await this.stockfishService.getBestMove(this.game.fen());
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
    this.stockfishService.stop();
  }
}

