import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LichessService {

  private apiUrl = 'https://lichess.org/api';
  private token = 'lip_p2KM5mufPCgyHYfdHFKP'; // Replace with your token

  constructor(private http: HttpClient) {}

  // Set headers with token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  // Create a new game
  createGame(): Observable<any> {
    const url = `${this.apiUrl}/challenge/open`;
    return this.http.post(url, {}, { headers: this.getHeaders() });
  }

  // Make a move in an ongoing game
  makeMove(gameId: string, move: string): Observable<any> {
    const url = `${this.apiUrl}/bot/game/${gameId}/move/${move}`;
    return this.http.post(url, {}, { headers: this.getHeaders() });
  }

  // Get game state
  getGameState(gameId: string): Observable<any> {
    const url = `${this.apiUrl}/game/stream/${gameId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
