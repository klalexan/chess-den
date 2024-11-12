import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {

  private stockfish: Worker | null = null;

  constructor() { 
    this.loadStockfish();
  }

  private async loadStockfish() {
    this.stockfish = new Worker('/assets/stockfish.js');

    this.stockfish.onmessage = (event) => {
      const message = event.data;
      console.log("Stockfish message:", message);
    }
  }

  sendCommand(command: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(command);
    }
  }

  getBestMove(fen: string, level: number): Promise<string> {
    return new Promise((resolve) => {
      if (!this.stockfish) return;

      this.stockfish.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith("bestmove")) {
          resolve(message.split(" ")[1]); // Get the best move
        }
      };

      // Send commands to Stockfish
      // this.sendCommand("uci");             // Initialize UCI mode
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand("setoption name Skill Level value " + level); // Set bot level
      this.sendCommand("go depth 1");     // Set analysis depth
    })
  }

  stop() {
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
    }
  }
}
