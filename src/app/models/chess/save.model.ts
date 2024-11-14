import { Move } from "chess.js";

export interface Save {
    fen?: string;
    history?: Move[]
    updatedAt?: string;
}