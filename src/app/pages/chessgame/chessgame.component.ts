import { AfterViewInit, Component, OnInit, effect, signal } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { Chess } from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import { Status } from '../../models/chess/status.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-chessgame',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.scss'
})
export class ChessgameComponent implements OnInit, AfterViewInit {

  chess: Chess;
  status: BehaviorSubject<Status> = new BehaviorSubject<Status>(Status.white);
  board: any;
  availableMoves = new BehaviorSubject<string[]>([]);
  fen = new FormControl('8/2k5/8/8/4P3/4K3/8/8 w - - 0 1');
  showBoard = signal(true);
  engineMove =  signal('');
  emtpyBoard:string = '8/8/8/8/8/8/8/8 w - - 0 1';


  constructor(private engine: EngineService) {
    this.chess = this.engine.getChessInstance();
   }

  ngOnInit(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      this.board = Chessground(boardElement, {});
      this.board.set({
        turnColor: 'white',
        movable: {
          color: 'both',
        },
        events: {
          move: (orig:string, dest:string) => {
          },
          dropNewPiece: (piece: any, key: string) => {
            console.log('dropNewPiece', piece, key);
          },
          select: (key: string) => {
            console.log('select', key);
          },
          insert: (elements: any) => {
            console.log('insert', elements);
          },
          change: () => {
            this.fen.setValue(this.board.getFen() + ' w - - 0 1');
            // console.log(this.board.getFen());
          }
        },
        draggable: {
          deleteOnDropOff: true,
        },
        selectable: {
          enabled: true,
        },
        drawable: {
          enabled: true,
          visible: true,
        },
        animation: {
          enabled: true,
          duration: 200,
        },
        disableContextMenu: false,
        resizable: true,
        addPieceZIndex: true,
        coordinates: true,
        autoCastle: true,
        viewOnly: false,
        blockTouchScroll: false,
        addDimensionsCssVarsTo: boardElement,
        trustAllEvents: false,

      });
    }
      this.status.subscribe((status: Status) => {
        switch (status) {
          case Status.white:
            this.availableMoves.next(this.chess.moves());
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

  ngAfterViewInit(): void {
   
  }

  public setBoard(): void {
    if (this.showBoard()) {
      this.board.set({fen: this.chess.fen()});
    }
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
    }
  }

  public makeMove(): void {
    this.engine.getBestMove(this.chess).then((bestMove: string) => {
      if (bestMove) {
        console.log(bestMove);
        const from = bestMove.substring(0,2);
        const to = bestMove.substring(2,4);
        const promotion = bestMove.length === 5 ? bestMove.substring(4,5): '';
        const moves = this.chess.moves({ verbose: true });
        for (const move of moves) {
          if (move.from === from && move.to === to) {
            this.engineMove.set(move.san);
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
    this.setBoard();
  }

  startNewGame(): void {
    this.chess = this.engine.getChessInstance();
    console.log(this.board.getFen());
    if (this.fen.value) {
      this.chess.load(this.fen.value);
      this.status.next(Status.white);
    }
    this.setBoard();
  }

  setBoardAsVisible(event: Event): void {
    const ischecked = (<HTMLInputElement>event.target).checked
    this.showBoard.set(ischecked);
  }
}

