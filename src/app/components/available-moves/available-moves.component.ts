import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessGameService } from '../../services/chessgame.service';

@Component({
  selector: 'app-available-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-moves.component.html',
  styleUrl: './available-moves.component.scss'
})
export class AvailableMovesComponent implements OnChanges {

  availableMoves: string[] = [];

  @Input() fen: string = '';
  @Output() move = new EventEmitter<string>();

  constructor(private chessGame: ChessGameService){}

  onMoveClick(move: string): void {
    this.move.emit(move);
  }

  ngOnChanges(): void {
    const game = this.chessGame.loadGameFromFen(this.fen);
    this.availableMoves = game.moves();
  }

}
