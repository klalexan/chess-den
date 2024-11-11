import { Injectable } from '@angular/core';
import { Chess, Move, Piece, Square, Color } from 'chess.js';
import { StockfishService } from './stockfish.service';

@Injectable({
  providedIn: 'root'
})
export class ChessGameService {

  constructor(private stockfishService: StockfishService) { }

  public async getBestMove(fen: string): Promise<string> {

    const bestMove = await this.stockfishService.getBestMove(fen);
    return bestMove;

  }

  public newGame(): Chess {
    return new Chess();
  }

  public loadGameFromFen(fen: string): Chess {
    return new Chess(fen);
  }

  public loadGameFromPgn(pgn: string): Chess {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess;
  }

  public move(chess: Chess, move: { from: string; to: string }): boolean {
    try {
      chess.move(move);
      return true;
    } catch (error) {
      return false;
    }
  }

  public stop(): void {
    this.stockfishService.stop();
  }




}
