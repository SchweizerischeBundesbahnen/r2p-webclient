import { Injectable, signal } from '@angular/core';
import { TrainRow } from './table-row';

@Injectable()
export class TrafficOverviewTableFilterService {
    readonly trainNumber = signal<string>('');
    readonly operationalDayFrom = signal<string>('');
    readonly operationalDayTo = signal<string>('');

    clearFilters() {
        this.trainNumber.set('');
        this.operationalDayFrom.set('');
        this.operationalDayTo.set('');
    }

    applyFilterOn(items: TrainRow[] | undefined): TrainRow[] {
        if (!items) return [];

        const trainNumber = this.trainNumber().trim().toLowerCase();
        const from = this.operationalDayFrom();
        const to = this.operationalDayTo();

        return items.filter((train) => {
            if (trainNumber && !train.trainNumber?.toLowerCase().includes(trainNumber)) {
                return false;
            }
            // works as long as format is YYYY-MM-DD
            if (from && (train.operationalDay ?? '') < from) {
                return false;
            }
            // works as long as format is YYYY-MM-DD
            if (to && (train.operationalDay ?? '') > to) {
                return false;
            }
            return true;
        });
    }
}
