import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tr[appTrainRow]',
    template: `
        <td>
            <strong>{{ train().trainNumber }}</strong>
        </td>
        <td>
            {{ train().start }}<br /><span class="text-muted" style="font-size:0.75rem;"
                ><ng-container i18n="@@tableRow.dep">Dep:</ng-container> {{ train().startTime | date: 'shortTime' }}</span
            >
        </td>
        <td>
            {{ train().end }}<br /><span class="text-muted" style="font-size:0.75rem;"
                ><ng-container i18n="@@tableRow.arr">Arr:</ng-container> {{ train().endTime | date: 'shortTime' }}</span
            >
        </td>
        <td>{{ train().operationalDay | date: 'mediumDate' }}</td>
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
            <span class="traffic-light tl-yellow"><span class="tl-dot"></span></span>
        </td>
    `,
    styles: [``],
    imports: [DatePipe],
})
export class TableRow {
    readonly train = input.required<TrainRow>();
}

export interface TrainRow {
    id: string | undefined;
    trainNumber: string | undefined;
    operationalDay: string | undefined;
    partners: string[] | undefined;
    start: string | undefined;
    startTime: string | undefined;
    end: string | undefined;
    endTime: string | undefined;
    revInfo: {
        lastChange: string | undefined;
        version: string | undefined;
    };
}
