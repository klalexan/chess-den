import { Component, OnInit } from '@angular/core';
import { Chess } from 'chess.js';
import { Chessground } from 'chessground';
import { LichessService } from '../../services/lichess.service';

@Component({
  selector: 'app-lichesswrapper',
  standalone: true,
  imports: [],
  templateUrl: './lichesswrapper.component.html',
  styleUrl: './lichesswrapper.component.scss'
})
export class LichesswrapperComponent implements OnInit  {

  private game: Chess = new Chess();
  private board: any;
  private gameId: string | null = null;

  constructor(private lichessService: LichessService) {}

  ngOnInit(): void {
    this.initializeBoard();
    // this.createLichessGame();
  }

  // Initialize Chessground board
  private initializeBoard(): void {
    this.board = Chessground(document.getElementById('board')!, {
      draggable: { enabled: true },
      movable: {
        color: 'both',
        free: false,
        events: { after: (from, to) => this.onMove(from, to) },
      },
      highlight: { lastMove: true },
      fen: this.game.fen()
    });
  }

  // Create game on Lichess
  public createLichessGame(): void {
    this.lichessService.createGame().subscribe((data) => {
      this.gameId = data.id;
      console.log('Lichess game created with ID:', this.gameId);
    });
  }

  // Handle moves
  onMove(from: string, to: string): void {
    const move = this.game.move({ from, to });
    if (move) {
      this.board?.set({ fen: this.game.fen() });
      if (this.gameId) this.lichessService.makeMove(this.gameId, move.san).subscribe();
    } else {
      console.error('Invalid move');
    }
  }

}
