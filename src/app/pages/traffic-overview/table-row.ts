import { Component, input } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { Train } from '../../shared/models/api.models';
import { OverallStatusComponent } from '../../shared/components/overall-status/overall-status.component';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tr[appTrainRow]',
    template: `
        <td class="td-train-number">
            <span class="train-number">{{ train().trainNumber }}</span>
        </td>
        <td class="td-route">
            <div class="cell-route">{{ train().start ?? '-' }} <span class="route-arrow">→</span> {{ train().end ?? '-' }}</div>
            <div class="cell-sub"
                ><ng-container i18n="@@common.dep">Dep:</ng-container>
                {{ train().startTime | date: 'HH:mm' : 'UTC' }} ·
                <ng-container i18n="@@common.arr">Arr:</ng-container>
                {{ train().endTime | date: 'HH:mm' : 'UTC' }}</div
            >
        </td>
        <td class="td-small">{{ isoDateToUtc(train().operationalDay) | date: 'mediumDate' : 'UTC' }}</td>
        <td>
            <div class="partners-cell">
                @for (partner of train().partners ?? []; track partner) {
                    <app-partner-badge [partner]="partner" />
                }
            </div>
        </td>
        <td class="td-small">
            @let lastChangeDate = train().revInfo.lastChange | date: 'mediumDate';
            @let lastChangeTime = train().revInfo.lastChange | date: 'HH:mm';
            <div>{{ lastChangeDate && lastChangeTime ? lastChangeDate + ', ' + lastChangeTime : '-' }}</div>
            <div class="cell-sub">{{ train().revInfo.version | slice: 0 : 7 }}</div>
        </td>
        <td>
            <app-overall-status [train]="train().trainData" />
        </td>
        <td class="td-chevron">
            <span class="material-icons row-chevron">chevron_right</span>
        </td>
    `,
    styles: [
        `
            :host td {
                padding: 0.375rem var(--spacing-sm);
                color: var(--text-secondary);
                font-size: 0.8125rem;
                vertical-align: middle;
            }
            .td-train-number {
                padding-left: var(--spacing-md);
            }
            .train-number {
                font-weight: 600;
                color: var(--text-primary);
                font-size: 0.8125rem;
            }
            .td-small {
                font-size: 0.75rem;
            }
            .cell-route {
                font-size: 0.8125rem;
                color: var(--text-primary);
                font-weight: 500;
            }
            .route-arrow {
                color: var(--steel);
                margin: 0 2px;
            }
            .cell-sub {
                font-size: 0.7rem;
                color: var(--text-muted);
                margin-top: 2px;
            }
            .partners-cell {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .td-chevron {
                width: 24px;
                padding: 0 8px 0 4px;
                text-align: right;
            }
            .row-chevron {
                font-size: 1.125rem;
                color: var(--text-muted);
                opacity: 0.3;
                transition: opacity 0.15s, transform 0.15s;
                vertical-align: middle;
            }
            :host-context(tr.clickable:hover) .row-chevron {
                opacity: 0.8;
                transform: translateX(2px);
            }
        `,
    ],
    imports: [DatePipe, SlicePipe, OverallStatusComponent, PartnerBadge],
})
export class TableRow {
    readonly train = input.required<TrainRow>();
    protected readonly isoDateToUtc = isoDateToUtc;
}

export interface TrainRow {
    /** Optional: comes from Train.id which is optional in OpenAPI */
    id: string | undefined;
    trainNumber: string;
    operationalDay: string;
    /** Optional: partners not required in TrainListElement */
    partners: string[] | undefined;
    /** Optional: derived from Journey locations which are optional */
    start: string | undefined;
    startTime: string | undefined;
    /** Optional: derived from Journey locations which are optional */
    end: string | undefined;
    endTime: string | undefined;
    revInfo: {
        lastChange: string;
        version: string;
    };
    trainData: Train;
}
