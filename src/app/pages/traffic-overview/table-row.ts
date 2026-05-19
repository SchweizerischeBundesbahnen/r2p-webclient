import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
                >Dep: {{ train().startTime | date: 'dd.MM.yyyy, HH:mm' }}</span
            >
        </td>
        <td>
            {{ train().end }}<br /><span class="text-muted" style="font-size:0.75rem;"
                >Arr: {{ train().endTime | date: 'dd.MM.yyyy, HH:mm' }}</span
            >
        </td>
        <td>{{ train().operationalDay }}</td>
        <td>
            @for (partner of train().partners ?? []; track partner) {
                <span class="partner-badge partner-badge-{{ partner }}">{{ partner }}</span>
            }
        </td>
        <td>
            {{ train().revInfo.lastChange | date: 'dd.MM.yyyy, HH:mm' }}<br />
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
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    readonly train = input.required<TrainRow>();

    protected async navigateToTrafficView() {
        await this.router.navigate(['../traffic-view' + this.train().id]);
    }
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
