import { Routes } from '@angular/router';
import { TrafficOverviewPage } from './pages/traffic-overview/traffic-overview-page';
import { Layout } from './pages/layout';
import { CreateTrainPage } from './pages/create-train/create-train-page';
import { TrafficPage } from './pages/traffic-view/traffic-page';
import { ReadTrainPage } from './pages/read-train/read-train-page';
import { EditTrainPage } from './pages/edit-train/edit-train-page';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', redirectTo: 'traffic-overview', pathMatch: 'full' },
            { path: 'traffic-overview', component: TrafficOverviewPage },
            { path: 'traffic-view', component: TrafficPage },
            { path: 'create-train', component: CreateTrainPage },
            { path: 'edit-train', component: EditTrainPage },
            { path: 'read-train', component: ReadTrainPage },
        ],
    },
];
