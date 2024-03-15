import { Injectable } from '@angular/core';
import { Chess, Move, Piece, Square, Color } from 'chess.js';
import * as engine from './stockfish.worker';


@Injectable({
  providedIn: 'root'
})
export class EngineService {

  constructor() { 
    
  }

  public humanMove(chess: Chess, move: string): boolean {
    try {
       chess.move(move);
       return true;
    } catch (e:any) {
      return false;
    }
    
  }

  public move(chess: Chess, from: string, to: string, promotion: string): boolean {
    return chess.move({ from, to, promotion }) !== null;
  }

  public getChessInstance(): Chess {
    return new Chess();
  }

  public getChessInstanceFromFen(fen: string): Chess {
    return new Chess(fen);
  }

  public getChessInstanceFromPgn(pgn: string): Chess {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess;
  }

  public getSquareFromChessInstance(chess: Chess, square: string): Piece {
    return chess.get(square as Square);
  }

  public async getBestMove(chess: Chess): Promise<string> {

    const bestMove = await engine.getBest(chess.fen(), 10);
    return bestMove;

  }

  isMoveValid(chess: Chess, move: string): boolean {
    return chess.move(move) !== null;
  }

  public isCheck(chess: Chess): boolean {
    return chess.inCheck();
  }

  public isCheckmate(chess: Chess): boolean {
    return chess.isCheckmate();
  }

  public isStalemate(chess: Chess): boolean {
    return chess.isStalemate();
  }

  public isDraw(chess: Chess): boolean {
    return chess.isDraw();
  }

  public moveNumber(chess: Chess): number {
    return chess.moveNumber();
  }

  public turn(chess: Chess): Color {
    return chess.turn();
  }

  public fen(chess: Chess): string {
    return chess.fen();
  }

  public history(chess: Chess): string[] {
    return chess.history();
  }

  public undo(chess: Chess): Move | null {
    return chess.undo();
  }

  public isGameOver(chess: Chess): boolean {
    return chess.isGameOver();
  }

}
