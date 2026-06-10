import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { Train } from '../../shared/models/api.models';
import { OverallStatusComponent } from '../../shared/components/overall-status/overall-status.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tr[appTrainRow]',
    template: `
        <td>
            <strong>{{ train().trainNumber }}</strong>
        </td>
        <td>
            {{ train().start ?? '-' }}<br /><span class="text-muted" style="font-size:0.75rem;"
                ><ng-container i18n="@@tableRow.dep">Dep:</ng-container>
                {{ train().startTime | date: 'shortTime' }}</span
            >
        </td>
        <td>
            {{ train().end ?? '-' }}<br /><span class="text-muted" style="font-size:0.75rem;"
                ><ng-container i18n="@@tableRow.arr">Arr:</ng-container>
                {{ train().endTime | date: 'shortTime' }}</span
            >
        </td>
        <td>{{ isoDateToUtc(train().operationalDay) | date: 'mediumDate' : 'UTC' }}</td>
        <td>
            @for (partner of train().partners ?? []; track partner) {
                <span class="partner-badge partner-badge-{{ partner }}">{{ partner }}</span>
            }
        </td>
        <td>
            {{ train().revInfo.lastChange | date: 'short' }}<br />
            <span class="text-muted" style="font-size:0.75rem;">{{ train().revInfo.version }}</span>
        </td>
        <td>
            <app-overall-status [train]="train().trainData" />
        </td>
    `,
    styles: [``],
    imports: [DatePipe, OverallStatusComponent],
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
