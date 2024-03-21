import { Component } from '@angular/core';
import { ChessgameService } from '../../../services/chessgame/chessgame.service';
import { Move } from '../../../models/chess/move.model';

@Component({
  selector: 'app-chess-moves',
  standalone: true,
  imports: [],
  templateUrl: './chess-moves.component.html',
  styleUrl: './chess-moves.component.scss'
})
export class ChessMovesComponent {


  moves: Move[] = [];
  constructor(private chessService: ChessgameService) { }

  ngOnInit(): void {

  }

  setSelectedMove(move: string) {
    console.log('move', move);
  }

}
