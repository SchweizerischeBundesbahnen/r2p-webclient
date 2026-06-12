import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrafficOverviewPageState } from './traffic-overview-page.state';
import { TrafficOverviewTableService } from './traffic-overview-table.service';
import { MatAnchor } from '@angular/material/button';
import { TrainFilterBar } from './train-filter-bar';
import { TrainTable } from './train-table';

@Component({
    selector: 'app-traffic-overview-page',
    imports: [RouterLink, MatAnchor, TrainFilterBar, TrainTable],
    template: `
        <div class="main-content">
            <div class="container">
                <div class="page-header">
                    <div>
                        <h1 class="page-title" i18n="@@trafficOverview.heading">Traffic Overview</h1>
                    </div>
                    @if (state.isInstanceOwner()) {
                        <a mat-raised-button color="primary" [routerLink]="'../create-train'" i18n="@@trafficOverview.newTrain"> ＋ New Train </a>
                    }
                </div>
                <app-train-filter-bar />
                <app-train-table />
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrafficOverviewPageState, TrafficOverviewTableService],
})
export class TrafficOverviewPage {
    protected readonly state = inject(TrafficOverviewPageState);
}
