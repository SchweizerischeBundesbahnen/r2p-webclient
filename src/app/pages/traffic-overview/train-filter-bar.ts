import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TrafficOverviewTableService } from './traffic-overview-table.service';

@Component({
    selector: 'app-train-filter-bar',
    imports: [MatButton],
    templateUrl: './train-filter-bar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainFilterBar {
    protected readonly tableService = inject(TrafficOverviewTableService);
}
