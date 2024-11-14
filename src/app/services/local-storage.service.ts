import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private key = 'chess-game';
  
  constructor() { }

  // Store data in localStorage
  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve data from localStorage
  getItem<T>(key: string): T |{} {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : {};
  }

  // Remove data from localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all data from localStorage
  clear(): void {
    localStorage.clear();
  }

  // Check if a key exists in localStorage
  containsKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
