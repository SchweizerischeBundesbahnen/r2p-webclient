import { Routes } from '@angular/router';
import { TrafficOverview } from './traffic-overview/traffic-overview';
import { TrainDetail } from './train-detail/train-detail';

export const routes: Routes = [
  { path: '', component: TrafficOverview },
  { path: 'train/:id', component: TrainDetail },
];
