import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableRow } from './table-row';
import { TrafficOverviewPageState } from './traffic-overview-page.state';
import { SortColumn, TrafficOverviewTableService } from './traffic-overview-table.service';

@Component({
    selector: 'app-traffic-overview-page',
    imports: [RouterLink, TableRow],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1 class="page-title" i18n="@@trafficOverview.heading">Traffic Overview</h1>
                    </div>
                    <a [routerLink]="'../create-train'" class="btn btn-success" i18n="@@trafficOverview.newTrain"> ＋ New Train </a>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <div class="filter-group">
                        <label for="filter-train-number" i18n="@@trafficOverview.filter.trainNumber">Train Number</label>
                        <input
                            type="text"
                            id="filter-train-number"
                            class="filter-input"
                            placeholder="e.g., IC 1234"
                            i18n-placeholder="@@trafficOverview.filter.trainNumberPlaceholder"
                            [value]="tableService.trainNumber()"
                            (input)="this.tableService.trainNumber.set($any($event.target).value)"
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-from" i18n="@@trafficOverview.filter.opDayFrom">Op. Day From</label>
                        <input
                            type="date"
                            id="filter-from"
                            class="filter-input"
                            [value]="tableService.operationalDayFrom()"
                            (change)="
                                this.tableService.operationalDayFrom.set($any($event.target).value)
                            "
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-to" i18n="@@trafficOverview.filter.opDayTo">Op. Day To</label>
                        <input
                            type="date"
                            id="filter-to"
                            class="filter-input"
                            [value]="tableService.operationalDayTo()"
                            (change)="tableService.operationalDayTo.set($any($event.target).value)"
                        />
                    </div>
                    <div class="filter-group" style="flex: 0; min-width: max-content;">
                        <label for="clear">&nbsp;</label>
                        <button
                            id="clear"
                            class="btn btn-ghost"
                            (click)="tableService.clearFilters()"
                            i18n="@@trafficOverview.filter.clear"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <!-- Train Table -->
                <div class="table-container">
                    <table id="trains-table">
                        <thead>
                            <tr>
                                <th
                                    class="sort-header"
                                    (click)="tableService.toggleSort('trainNumber')"
                                    style="cursor:pointer;"
                                >
                                    <ng-container i18n="@@trafficOverview.table.trainNo">Train No.</ng-container>
                                    <span class="sort-indicator">{{
                                        sortIndicator('trainNumber')
                                    }}</span>
                                </th>
                                <th
                                    class="sort-header"
                                    (click)="tableService.toggleSort('start')"
                                    style="cursor:pointer;"
                                >
                                    <ng-container i18n="@@trafficOverview.table.from">From</ng-container>
                                    <span class="sort-indicator">{{ sortIndicator('start') }}</span>
                                </th>
                                <th
                                    class="sort-header"
                                    (click)="tableService.toggleSort('end')"
                                    style="cursor:pointer;"
                                >
                                    <ng-container i18n="@@trafficOverview.table.to">To</ng-container>
                                    <span class="sort-indicator">{{ sortIndicator('end') }}</span>
                                </th>
                                <th
                                    class="sort-header"
                                    (click)="tableService.toggleSort('operationalDay')"
                                    style="cursor:pointer;"
                                >
                                    <ng-container i18n="@@trafficOverview.table.opDay">Op. Day</ng-container>
                                    <span class="sort-indicator">{{
                                        sortIndicator('operationalDay')
                                    }}</span>
                                </th>
                                <th i18n="@@trafficOverview.table.partners">Partners</th>
                                <th
                                    class="sort-header"
                                    (click)="tableService.toggleSort('lastChange')"
                                    style="cursor:pointer;"
                                >
                                    <ng-container i18n="@@trafficOverview.table.lastChange">Last Change / Version</ng-container>
                                    <span class="sort-indicator">{{
                                        sortIndicator('lastChange')
                                    }}</span>
                                </th>
                                <th>
                                    <ng-container i18n="@@trafficOverview.table.status">Status</ng-container>
                                    <span class="tooltip-anchor" tabindex="0"
                                        >?<span class="tooltip-box"
                                            ><ng-container i18n="@@trafficOverview.status.allConfirmed">🟢 Circle: All activities are <em>confirmed</em>.</ng-container><br /><ng-container i18n="@@trafficOverview.status.someProposed">🟧 Square: At least one activity is <em>proposed</em> or <em>requested</em>, none refused.</ng-container><br /><ng-container i18n="@@trafficOverview.status.someRefused">🔺 Triangle: At least one activity is <em>refused</em> or <em>dropped</em>.</ng-container></span
                                        ></span
                                    >
                                </th>
                            </tr>
                        </thead>
                        <tbody id="trains-tbody">
                            @for (
                                train of tableService.applyFilterOn(trainListResource.hasValue() ? trainListResource.value() : []);
                                track train.id
                            ) {
                                <tr
                                    appTrainRow
                                    class="clickable"
                                    [train]="train"
                                    [routerLink]="'../traffic-view/' + train.id"
                                ></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div id="empty-state" class="empty-state" style="display:none;">
                    <div class="empty-state-icon">🚆</div>
                    <p class="empty-state-text" i18n="@@trafficOverview.empty.noTrains">No trains found</p>
                    <p class="text-muted" style="font-size:0.875rem;" i18n="@@trafficOverview.empty.hint">
                        Try adjusting your filters or create a new train.
                    </p>
                </div>
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrafficOverviewPageState, TrafficOverviewTableService],
})
export class TrafficOverviewPage {
    protected state = inject(TrafficOverviewPageState);
    protected trainListResource = this.state.trainListResource;
    protected tableService = inject(TrafficOverviewTableService);

    protected sortIndicator(column: SortColumn): string {
        if (this.tableService.sortColumn() !== column) return '⇅';
        return this.tableService.sortDirection() === 'asc' ? '↑' : '↓';
    }
}
