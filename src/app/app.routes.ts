import { Routes } from '@angular/router';
import { Layout } from './pages/layout';
import { CreateTrainPage } from './pages/create-train/create-train-page';
import { TrafficOverviewPage } from './pages/traffic-overview/traffic-overview-page';
import { TrafficPage } from './pages/traffic/traffic-page';
import { TrafficPageState } from './pages/traffic/traffic-page.state';
import { ReadTrainPage } from './pages/read-train/read-train-page';
import { ReadTrainPageState } from './pages/read-train/read-train-page.state';
import { EditTrainPage } from './pages/edit-train/edit-train-page';
import { EditTrainPageState } from './pages/edit-train/edit-train-page.state';
import { NotFoundPage } from './pages/not-found/not-found-page';
import { settingsGuard } from './shared/guards/settings.guard';
import { oidcGuard } from './shared/guards/oidc.guard';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        canActivate: [settingsGuard, oidcGuard],
        children: [
            { path: '', redirectTo: 'traffic-overview', pathMatch: 'full' },
            { path: 'traffic-overview', component: TrafficOverviewPage },
            { path: 'traffic-view/:trainId', component: TrafficPage, providers: [TrafficPageState] },
            { path: 'create-train', component: CreateTrainPage },
            { path: 'edit-train', component: EditTrainPage, providers: [EditTrainPageState] },
            { path: 'read-train', component: ReadTrainPage, providers: [ReadTrainPageState] },
        ],
    },
    { path: '**', component: NotFoundPage },
];
