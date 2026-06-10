import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TableRow } from './table-row';
import { TrafficOverviewPageState } from './traffic-overview-page.state';
import { SortColumn, TrafficOverviewTableService } from './traffic-overview-table.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import { AlertBanner } from '../../shared/components/alert-banner/alert-banner';

@Component({
    selector: 'app-train-table',
    imports: [RouterLink, MatIcon, TableRow, Spinner, AlertBanner],
    templateUrl: './train-table.html',
    styleUrl: './train-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainTable {
    protected readonly state = inject(TrafficOverviewPageState);
    protected readonly tableService = inject(TrafficOverviewTableService);

    protected sortIndicator(column: SortColumn): string {
        if (this.tableService.sortColumn() !== column) return '⇅';
        return this.tableService.sortDirection() === 'asc' ? '↑' : '↓';
    }
}
