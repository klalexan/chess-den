import { Routes } from '@angular/router';
import { ChessgameComponent } from './pages/chessgame/chessgame.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LichesswrapperComponent } from './pages/lichesswrapper/lichesswrapper.component';

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
        data: {
        }
    },
    {
        path: 'lichessgame',
        component: LichesswrapperComponent,
        canActivate: [],
        data: {
        }
    }
];
