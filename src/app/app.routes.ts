import { Routes } from '@angular/router';
import { Layout } from './pages/layout';
import { CreateTrainPage } from './pages/create-train/create-train-page';
import { TrafficOverviewPage } from './pages/traffic-overview/traffic-overview-page';
import { TrafficPage } from './pages/traffic/traffic-page';
import { ReadTrainPage } from './pages/read-train/read-train-page';
import { EditTrainPage } from './pages/edit-train/edit-train-page';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { NotFoundPage } from './pages/not-found/not-found-page';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        canActivate: [autoLoginPartialRoutesGuard],
        children: [
            { path: '', redirectTo: 'traffic-overview', pathMatch: 'full' },
            { path: 'traffic-overview', component: TrafficOverviewPage },
            { path: 'traffic-view/:trainId', component: TrafficPage },
            { path: 'create-train', component: CreateTrainPage },
            { path: 'edit-train', component: EditTrainPage },
            { path: 'read-train', component: ReadTrainPage },
        ],
    },
    { path: '**', component: NotFoundPage },
];
