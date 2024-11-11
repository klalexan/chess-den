import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Chess } from 'chess.js';
import { ChessGameService } from '../../services/chessgame.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-available-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-moves.component.html',
  styleUrl: './available-moves.component.scss'
})
export class AvailableMovesComponent {

  private game: Chess = new Chess();
  @Input() availableMoves: string[] = [];
  @Output() moveMade = new EventEmitter<string[]>(); // Emit updated moves after each move

  constructor(private chessGame: ChessGameService) { }

  ngOnInit(): void {
    this.emitAvailableMoves();
  }

  onMoveClick(move: string): void {
    const moveObj = this.game.move(move); // Make the move
    if (moveObj) {
      this.emitAvailableMoves(); // Emit updated moves
    }
  }

  private emitAvailableMoves(): void {
    this.moveMade.emit(this.game.moves());
  }

}
