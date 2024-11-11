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
import { ChessboardComponent } from "../../components/chessboard/chessboard.component";
import { AvailableMovesComponent } from "../../components/available-moves/available-moves.component";

@Component({
  selector: 'app-chessgame',
  imports: [ReactiveFormsModule, CommonModule, ChessboardComponent, AvailableMovesComponent],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent implements OnInit {
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

