import { Routes } from '@angular/router';
import { OverviewPage } from './pages/overview/overview-page';
import { Layout } from './pages/layout';
import { Body } from './pages/create-train/body';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: 'overview', component: OverviewPage },
            { path: 'create-train', component: Body }
        ],
    },
];
