import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrafficOverviewPageState } from './traffic-overview-page.state';
import { TrafficOverviewTableService } from './traffic-overview-table.service';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TrainFilterBar } from './train-filter-bar';
import { TrainTable } from './train-table';

@Component({
    selector: 'app-traffic-overview-page',
    imports: [RouterLink, MatAnchor, MatIcon, TrainFilterBar, TrainTable],
    template: `
        <div class="main-content">
            <div class="container">
                <div class="page-header">
                    <div>
                        <h1 class="page-title" i18n="@@trafficOverview.heading">Traffic overview</h1>
                    </div>
                    <div class="page-header-actions">
                        <button
                            type="button"
                            class="filter-toggle"
                            [class.is-active]="filtersExpanded()"
                            [attr.aria-expanded]="filtersExpanded()"
                            (click)="toggleFilters()"
                        >
                            <mat-icon>filter_list</mat-icon>
                            <span i18n="@@trafficOverview.filters.toggle">Filters</span>
                            @if (tableService.activeFilterCount() > 0) {
                                <span class="filter-count">{{ tableService.activeFilterCount() }}</span>
                            }
                            <mat-icon class="chev">{{ filtersExpanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
                        </button>
                        @if (state.isInstanceOwner()) {
                            <a mat-raised-button color="primary" [routerLink]="'../create-train'" i18n="@@trafficOverview.newTrain"> + New train </a>
                        }
                    </div>
                </div>
                @if (filtersExpanded()) {
                    <app-train-filter-bar />
                }
                <app-train-table />
            </div>
        </div>
    `,
    styles: `
        .page-header-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }
        .filter-toggle {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            color: var(--navy);
            border: 1px solid var(--navy);
            border-radius: 8px;
            padding: 8px 14px;
            font: inherit;
            font-weight: 600;
            font-size: 0.8125rem;
            cursor: pointer;
            transition: background-color 0.15s, color 0.15s;
        }
        .filter-toggle:hover { background: var(--light-grey); }
        .filter-toggle.is-active { background: var(--navy); color: #ffffff; }
        .filter-toggle mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
        }
        .filter-toggle .chev { opacity: 0.8; }
        .filter-toggle .filter-count {
            background: var(--orange);
            color: #ffffff;
            border-radius: 999px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            font-size: 0.7rem;
            font-weight: 700;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrafficOverviewPageState, TrafficOverviewTableService],
})
export class TrafficOverviewPage {
    protected readonly state = inject(TrafficOverviewPageState);
    protected readonly tableService = inject(TrafficOverviewTableService);
    protected readonly filtersExpanded = signal(false);

    protected toggleFilters(): void {
        this.filtersExpanded.update((v) => !v);
    }
}
