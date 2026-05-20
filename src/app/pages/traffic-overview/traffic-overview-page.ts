import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableRow } from './table-row';
import { TrafficOverviewPageState } from './traffic-overview-page-state.service';
import { TrafficOverviewTableFilterService } from './traffic-overview-table-filter.service';

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
                        <h1 class="page-title">Traffic Overview</h1>
                    </div>
                    <a [routerLink]="'../create-train'" class="btn btn-success"> ＋ New Train </a>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <div class="filter-group">
                        <label for="filter-train-number">Train Number</label>
                        <input
                            type="text"
                            id="filter-train-number"
                            class="filter-input"
                            placeholder="e.g., IC 1234"
                            [value]="filterService.trainNumber()"
                            (input)="this.filterService.trainNumber.set($any($event.target).value)"
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-from">Op. Day From</label>
                        <input
                            type="date"
                            id="filter-from"
                            class="filter-input"
                            [value]="filterService.operationalDayFrom()"
                            (change)="
                                this.filterService.operationalDayFrom.set($any($event.target).value)
                            "
                        />
                    </div>
                    <div class="filter-group">
                        <label for="filter-to">Op. Day To</label>
                        <input
                            type="date"
                            id="filter-to"
                            class="filter-input"
                            [value]="filterService.operationalDayTo()"
                            (change)="filterService.operationalDayTo.set($any($event.target).value)"
                        />
                    </div>
                    <div class="filter-group" style="flex: 0; min-width: 100px;">
                        <label for="clear">&nbsp;</label>
                        <button
                            id="clear"
                            class="btn btn-ghost"
                            (click)="filterService.clearFilters()"
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
                                <th class="sort-header" id="th-trainNumber">
                                    Train No. <span class="sort-indicator"></span>
                                </th>
                                <th>From</th>
                                <th>To</th>
                                <th class="sort-header" id="th-operationalDay">
                                    Op. Day <span class="sort-indicator"></span>
                                </th>
                                <th>Partners</th>
                                <th class="sort-header" id="th-lastChange">
                                    Last Change / Version <span class="sort-indicator"></span>
                                </th>
                                <th>
                                    Status
                                    <span class="tooltip-anchor" tabindex="0"
                                        >?<span class="tooltip-box"
                                            >🟢 Circle: All activities are
                                            <em>confirmed</em>.<br />🟧 Square: At least one
                                            activity is <em>proposed</em> or <em>requested</em>,
                                            none refused.<br />🔺 Triangle: At least one activity is
                                            <em>refused</em> or <em>dropped</em>.</span
                                        ></span
                                    >
                                </th>
                            </tr>
                        </thead>
                        <tbody id="trains-tbody">
                            @for (
                                train of filterService.applyFilterOn(trainListResource.value());
                                track train.id
                            ) {
                                <tr
                                    appTrainRow
                                    class="clickable"
                                    [train]="train"
                                    [routerLink]="'../traffic-view/' + train.id"
                                ></tr>
                            }

                            <tr class="clickable" [routerLink]="'../traffic-view'">
                                <td><strong>IC 1234</strong></td>
                                <td>
                                    Zürich HB<br /><span
                                        class="text-muted"
                                        style="font-size:0.75rem;"
                                        >Dep: 08:00</span
                                    >
                                </td>
                                <td>
                                    Basel SBB<br /><span
                                        class="text-muted"
                                        style="font-size:0.75rem;"
                                        >Arr: 08:55</span
                                    >
                                </td>
                                <td>2025-06-15</td>
                                <td><span class="partner-badge partner-badge-BLS">BLS</span></td>
                                <td>
                                    10.04.2025, 10:30<br /><span
                                        class="text-muted"
                                        style="font-size:0.75rem;"
                                        >v-001</span
                                    >
                                </td>
                                <td>
                                    <span class="traffic-light tl-yellow"
                                        ><span class="tl-dot"></span
                                    ></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="empty-state" class="empty-state" style="display:none;">
                    <div class="empty-state-icon">🚆</div>
                    <p class="empty-state-text">No trains found</p>
                    <p class="text-muted" style="font-size:0.875rem;">
                        Try adjusting your filters or create a new train.
                    </p>
                </div>
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrafficOverviewPageState, TrafficOverviewTableFilterService],
})
export class TrafficOverviewPage {
    protected trainListResource = inject(TrafficOverviewPageState).trainListResource;
    protected filterService = inject(TrafficOverviewTableFilterService);

}

