import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChessgameService } from '../../../services/chessgame/chessgame.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-blindfold',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-blindfold.component.html',
  styleUrl: './chess-blindfold.component.scss'
})
export class ChessBlindfoldComponent {

  availableMoves: string[] = [];
  engineMove:string = '';
  ITEMS_PER_LINE = 6;
  lines = 0;

  constructor(private chessService: ChessgameService) {
    this.chessService.getAvailableMoves().subscribe(moves => {
      this.availableMoves = moves;
      this.lines = (this.availableMoves.length / this.ITEMS_PER_LINE) + 1;
    });
    this.chessService.getEngineMove().subscribe(move => {
      this.engineMove = move;
    });
  }

  setSelectedMove(move: string) {
    this.chessService.setSelectedMove(move);
  }
}
