import { Routes } from '@angular/router';
import { OverviewPage } from './pages/overview/overview-page';
import { Layout } from './pages/layout';
import { CreateTrainPage } from './pages/create-train/create-train-page';
import { TrafficViewPage } from './pages/traffic-view/traffic-view-page';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: OverviewPage },
            { path: 'create-train', component: CreateTrainPage },
            { path: 'traffic-view', component: TrafficViewPage },
        ],
    },
];
