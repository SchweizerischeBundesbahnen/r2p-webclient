import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { Train } from '../../shared/models/api.models';
import { OverallStatusComponent } from '../../shared/components/overall-status/overall-status.component';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tr[appTrainRow]',
    template: `
        <td>
            <strong>{{ train().trainNumber }}</strong>
        </td>
        <td>
            <div>{{ train().start ?? '-' }}</div>
            <div class="cell-sub"
                ><ng-container i18n="@@common.dep">Dep:</ng-container>
                {{ train().startTime | date: 'shortTime' }}</div
            >
        </td>
        <td>
            <div>{{ train().end ?? '-' }}</div>
            <div class="cell-sub"
                ><ng-container i18n="@@common.arr">Arr:</ng-container>
                {{ train().endTime | date: 'shortTime' }}</div
            >
        </td>
        <td>{{ isoDateToUtc(train().operationalDay) | date: 'mediumDate' : 'UTC' }}</td>
        <td>
            <div class="partners-cell">
                @for (partner of train().partners ?? []; track partner) {
                    <app-partner-badge [partner]="partner" />
                }
            </div>
        </td>
        <td>
            <div>{{ train().revInfo.lastChange | date: 'short' }}</div>
            <div class="cell-sub">{{ train().revInfo.version }}</div>
        </td>
        <td>
            <app-overall-status [train]="train().trainData" />
        </td>
    `,
    styles: [
        `
            .cell-sub {
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 2px;
            }
            .partners-cell {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
        `,
    ],
    imports: [DatePipe, OverallStatusComponent, PartnerBadge],
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
