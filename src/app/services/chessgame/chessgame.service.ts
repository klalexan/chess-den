import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessgameService {

  availableMoves = new BehaviorSubject<string[]>([]);
  selectedMove = new BehaviorSubject<string>('');
  engineMove = new BehaviorSubject<string>('');
  
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
}
