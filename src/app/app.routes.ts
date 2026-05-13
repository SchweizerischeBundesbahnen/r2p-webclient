import { Routes } from '@angular/router';
import { TrafficOverviewPage } from './pages/traffic-overview/traffic-overview-page';
import { Layout } from './pages/layout';
import { CreateTrainPage } from './pages/create-train/create-train-page';
import { TrafficViewPage } from './pages/traffic-view/traffic-view-page';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', redirectTo: 'traffic-overview', pathMatch: 'full' },
            { path: 'traffic-overview', component: TrafficOverviewPage },
            { path: 'create-train', component: CreateTrainPage },
            { path: 'traffic-view', component: TrafficViewPage },
        ],
    },
];
