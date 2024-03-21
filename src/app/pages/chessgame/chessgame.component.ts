import { AfterViewInit, Component, OnInit, effect, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { ChessgameService } from '../../services/chessgame/chessgame.service';

@Component({
  selector: 'app-chessgame',
  imports: [ReactiveFormsModule, CommonModule, MatExpansionModule, RouterModule],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent implements OnInit {

  chess: Chess;
  status: BehaviorSubject<Status> = new BehaviorSubject<Status>(Status.white);
  board: any;
  fen = new FormControl('8/2k5/8/4P3/4K3/8/8/8 w - - 0 1');
  engineMove =  signal('');
  emtpyBoard:string = '8/8/8/8/8/8/8/8 w - - 0 1';


  constructor(private engine: EngineService, private chessService: ChessgameService) {
    this.chess = this.engine.getChessInstance();
   }

  ngOnInit(): void {
    this.chessService.getSelectedMove().subscribe((move: string) => {
      if (move) {
        this.makeHumanMove(move, true);
      }
    });
   
    this.status.subscribe((status: Status) => {
        switch (status) {
          case Status.white:
            this.chessService.setAvailableMoves(this.chess.moves());
            break;
          case Status.black:
            this.makeMove();
            break;
          case Status.draw:
            this.drawGame();
            break;
          case Status.stalemate:
            this.drawGame();
            break;
          case Status.checkmate:
            this.endGame();
            break;
        }
    });
  }

  public setBoard(): void {
    this.chessService.setFen(this.chess.fen());
    
  }

  makeHumanMove(move: string, effect: boolean): void {
    if (this.engine.humanMove(this.chess, move)) {
      if (effect) {
        this.setBoard();
      }
      if (this.engine.isGameOver(this.chess)) {
        this.status.next(Status.checkmate);
      } else {
        this.status.next( Status.black);
      }
    } else {
      this.undoInvalidMove();
    }
  }

  public makeMove(): void {
    this.engine.getBestMove(this.chess).then((bestMove: string) => {
      if (bestMove) {
        const from = bestMove.substring(0,2);
        const to = bestMove.substring(2,4);
        const promotion = bestMove.length === 5 ? bestMove.substring(4,5): '';
        const moves = this.chess.moves({ verbose: true });
        for (const move of moves) {
          if (move.from === from && move.to === to) {
            this.chessService.setEngineMove(move.san);
          }
        }
        this.engine.move(this.chess, from, to, promotion);
        this.setBoard();
        if (this.engine.isGameOver(this.chess)) {
          this.status.next(Status.checkmate);
        } else {
          this.status.next(Status.white);
        }
      }
    });
  }

  public endGame(): void {
    console.log(this.chess.history());
    console.log(this.chess.pgn());
  }

  public drawGame(): void {
    console.log('Game drawn');
  }

  public undo(): void {
    this.engine.undo(this.chess);
    if (this.engine.turn(this.chess) === 'b') {
      this.engine.undo(this.chess);
    }
    this.chessService.setAvailableMoves(this.chess.moves());
    this.setBoard();
  }

  undoInvalidMove(): void {
    this.engine.undo(this.chess);
    this.chessService.setAvailableMoves(this.chess.moves());
    this.setBoard();
  }

  startNewGame(): void {
    this.chess = this.engine.getChessInstance();
    if (this.fen.value) {
      this.chess.load(this.fen.value);
      this.status.next(Status.white);
    }
    this.setBoard();
  }

  dragNewPiece(piece: Piece, event: Event): void {
    this.board.dragNewPiece(piece, event);
  }
}

