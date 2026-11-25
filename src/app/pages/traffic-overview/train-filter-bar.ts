import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TrafficOverviewTableService } from './traffic-overview-table.service';

@Component({
    selector: 'app-train-filter-bar',
    imports: [MatButton, MatFormField, MatLabel, MatInput],
    templateUrl: './train-filter-bar.html',
    styleUrl: './train-filter-bar.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainFilterBar {
    protected readonly tableService = inject(TrafficOverviewTableService);
}
