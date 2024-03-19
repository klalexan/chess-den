import { Routes } from '@angular/router';
import { ChessgameComponent } from './pages/chessgame/chessgame.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChessBoardGameComponent } from './pages/chessgame/chess-board-game/chess-board-game.component';

export const routes: Routes = [

    {
        path: '',
        component: DashboardComponent,
        data: {
        }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
        }
    },
    {
        path: 'chessgame',
        component: ChessgameComponent,
        canActivate: [],
        loadChildren: () => import('./pages/chessgame/chessgame.routes').then(m => m.chessRoutes),
        data: {
        }
    },
];
