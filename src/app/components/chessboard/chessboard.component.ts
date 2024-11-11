import { Component, EventEmitter, OnInit, Output, ViewChild, effect, signal } from '@angular/core';
import { Chessground } from 'chessground';
import { ChessGameService } from '../../services/chessgame.service';
import { Chess } from 'chess.js';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss'
})
export class ChessboardComponent implements OnInit {

  game: Chess;
  board: any;
  @Output() moveMade = new EventEmitter<string[]>(); 

  constructor(private chessGame: ChessGameService) {
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

  async onMove(from: string, to: string): Promise<void> {
    const move = this.chessGame.move(this.game, { from, to });
      if (!move) {
        // Move is invalid, show an error or reset the board state
        this.highlightInvalidMove(from, to);
        console.log("Invalid move:", from, to);
        this.board.set({ fen: this.game.fen() }); // Reset to the previous valid position
        // Highlight the invalid move attempt
        
        
        return;
      }
      
      const bestMove = await this.chessGame.getBestMove(this.game.fen());
      console.log("Best Move from Stockfish:", bestMove);
      if (bestMove) {
        this.makeEngineMove(bestMove);
      }
  }

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

}
