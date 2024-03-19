import { Routes } from '@angular/router';
import { ChessBoardGameComponent } from './chess-board-game/chess-board-game.component';
import { ChessBlindfoldComponent } from './chess-blindfold/chess-blindfold.component';

export const chessRoutes: Routes = [
    {
        path: '',
        redirectTo: 'board-game',
        pathMatch: 'full'
    },
    {
        path: 'board-game',
        component: ChessBoardGameComponent,
        data: {
        }
    },
    {
        path: 'blind-fold',
        component: ChessBlindfoldComponent,
        data: {
        }
    },
    {
        path: 'moves',
        component: ChessBoardGameComponent,
        data: {
        }
    },
    {
        path: 'settings',
        component: ChessBoardGameComponent,
        data: {
        }
    },
];