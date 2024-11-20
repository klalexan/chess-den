import { Component, Renderer2 } from '@angular/core';
import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import { CommonModule } from '@angular/common';
import { ChessGameService } from '../../services/chessgame.service';
import { ChessboardComponent } from "../../components/chessboard/chessboard.component";
import { AvailableMovesComponent } from "../../components/available-moves/available-moves.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { LocalStorageService } from '../../services/local-storage.service';
import { Save } from '../../models/chess/save.model';
import { MoveHistoryComponent } from "../../components/move-history/move-history.component";
import { ChessboardEditorComponent } from "../../components/chessboard-editor/chessboard-editor.component";

@Component({
  selector: 'app-chessgame',
  imports: [CommonModule, ChessboardComponent, AvailableMovesComponent, ReactiveFormsModule, MatCheckboxModule, MatSelectModule, MoveHistoryComponent, ChessboardEditorComponent],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent {
  game: Chess;
  blindfoldMode: boolean = false;
  isBotPlaysAsWhite = new FormControl(false);
  fen: string;
  inputFEN = new FormControl('8/2k2P2/8/8/4P3/4K3/8/8 w - - 0 1');
  engineMove: string = '';
  botLevel = new FormControl(1);
  editMode = false;

  constructor(
    private chessGame: ChessGameService,
    private localStorageService: LocalStorageService,
    private renderer: Renderer2
    ) {

      this.game = this.chessGame.newGame();
      this.fen = this.game.fen();
  }

  async createNewGame(): Promise<void> {
    this.game = this.chessGame.newGame();
    this.fen = this.game.fen();
    this.makeEngineMoveIfnBotTurn();
  }

  async loadGameFromFEN(): Promise<void> {
    if (this.inputFEN.value) {
      this.fen = this.inputFEN.value;
      this.game = this.chessGame.loadGameFromFen(this.fen);
      this.makeEngineMoveIfnBotTurn();
    }
  }

  undoMove() {
    this.game.undo();
    this.game.undo();
    this.fen = this.game.fen();
    this.saveGame();
    this.engineMove = '';
  }

  toggleBlindfold(): void {
    this.blindfoldMode = !this.blindfoldMode;
  }

  botLevels () {
    var values = [];
    const numLevels = 20;
    const minElo = 1100;
    const maxElo = 3100;
    for (var i = 0; i <= numLevels; i++) {
      const elo =
        Math.floor((minElo + (maxElo - minElo) * (i / numLevels)) / 100) * 100;
      values.push({ value: i, label: elo });
    }
    return values;
  };


  async onMove(move: string): Promise<void> {
    this.game.move(move);
    this.saveGame();
    if (this.game.isGameOver()) {
      this.engineMove = '';
      return;
    }
    setTimeout(() => {
      this.makeEngineMoveIfnBotTurn();
    }, 1000);
    
  }

  makeEngineMove(bestMove: string) {
    const from = bestMove.slice(0, 2);
    const to = bestMove.slice(2, 4);
    const promotion = bestMove.length === 5 ? bestMove.substring(4,5): '';
    const move = this.game.move({ from, to, promotion });
    this.engineMove = move.san;
    this.fen = this.game.fen();
  }



  async updateBotColor(): Promise<void> {
    this.makeEngineMoveIfnBotTurn();
    this.saveGame();
  }

  async makeEngineMoveIfnBotTurn(): Promise<void> {
    const isBotTurn = this.isBotPlaysAsWhite.value && this.game.turn() === 'w' || !this.isBotPlaysAsWhite.value && this.game.turn() === 'b';
    if (isBotTurn) {
      const bestMove = await this.chessGame.getBestMove(this.game.fen(), this.botLevel.value);
      if (bestMove) {
        this.makeEngineMove(bestMove);
        this.saveGame();
      }
    }
  }

  get moveHistory(): { white: string, black: string }[] {
    const history = this.game.history({verbose: true});
    const pairedMoves = [];
    for (let i = 0; i < history.length; i += 2) {
      pairedMoves.push({white: history[i] ? history[i].san : '', black: history[i + 1] ? history[i + 1].san : ''});
    }

    return pairedMoves;

  }

  saveGame(): void {
    this.localStorageService.setItem('chessGame', {
      fen: this.game.fen(),
      history: this.game.history({verbose: true}),
      updatedAt: new Date().toISOString()
    });
  }

  loadSavedGame(): void {
    const save: Save = this.localStorageService.getItem('chessGame');

    if (save.fen) {
      this.game = this.chessGame.newGame();
      save.history?.forEach(move => this.game.move(move));
      this.fen = this.game.fen();
    }
  }

  dragDropPiece({pieceSymbol, color, key}: {pieceSymbol: string, color: string, key: string}): void {
    this.game.put({type: pieceSymbol as PieceSymbol, color: color as Color}, key as Square);
    // this.game.remove(key as Square);
    this.fen = this.game.fen();
  }

  setEditedBoard(fen: string): void {
    this.fen = fen;
    this.editMode = false;
    this.game = this.chessGame.loadGameFromFen(fen);
    setTimeout(() => {
      this.makeEngineMoveIfnBotTurn();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.chessGame.stop();
  }
}

