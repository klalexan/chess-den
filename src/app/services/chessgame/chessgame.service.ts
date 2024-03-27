import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Status } from '@models/chess/status.model';
import { Color } from 'chessground/types';

@Injectable({
  providedIn: 'root'
})
export class ChessgameService {

  availableMoves = new BehaviorSubject<string[]>([]);
  selectedMove = new BehaviorSubject<string>('');
  engineMove = new BehaviorSubject<string>('');
  fen = new BehaviorSubject<string>('');
  status = new BehaviorSubject<Status>(Status.white);
  playerColor = new BehaviorSubject<Color>('white');
  
  constructor() { }

  getAvailableMoves() {
    return this.availableMoves.asObservable();
  }

  setAvailableMoves(moves: string[]) {
    this.availableMoves.next(moves);
  }

  getSelectedMove() {
    return this.selectedMove.asObservable();
  }

  setSelectedMove(move: string) {
    this.selectedMove.next(move);
  }

  getEngineMove() {
    return this.engineMove.asObservable();
  }

  setEngineMove(move: string) {
    this.engineMove.next(move);
  }

  getFen() {
    return this.fen.asObservable();
  }

  setFen(fen: string) {
    this.fen.next(fen);
  }

  getStatus() {
    return this.status.asObservable();
  }

  setStatus(status: Status) {
    this.status.next(status);
  }

  getPlayerColor() {
    return this.playerColor.asObservable();
  }

  setPlayerColor(color: Color) {
    this.playerColor.next(color);
  }
}
