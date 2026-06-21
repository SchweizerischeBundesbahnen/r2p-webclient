import { Injectable, computed, signal } from '@angular/core';
import { TrainRow } from './table-row';

export type SortColumn = 'trainNumber' | 'start' | 'end' | 'operationalDay' | 'lastChange';
export type SortDirection = 'asc' | 'desc';

@Injectable()
export class TrafficOverviewTableService {
    readonly trainNumber = signal<string>('');
    readonly operationalDayFrom = signal<string>('');
    readonly operationalDayTo = signal<string>('');
    readonly sortColumn = signal<SortColumn | null>(null);
    readonly sortDirection = signal<SortDirection>('asc');

    /** Number of active filters — drives the collapsed filter toggle's count badge. */
    readonly activeFilterCount = computed(() => {
        let count = 0;
        if (this.trainNumber().trim()) count++;
        if (this.operationalDayFrom()) count++;
        if (this.operationalDayTo()) count++;
        return count;
    });

    toggleSort(column: SortColumn): void {
        if (this.sortColumn() === column) {
            this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortColumn.set(column);
            this.sortDirection.set('asc');
        }
    }

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

        let result = items.filter((train) => {
            if (trainNumber && !train.trainNumber?.toLowerCase().includes(trainNumber)) {
                return false;
            }
            if (from && (train.operationalDay ?? '') < from) {
                return false;
            }
            if (to && (train.operationalDay ?? '') > to) {
                return false;
            }
            return true;
        });

        const col = this.sortColumn();
        const dir = this.sortDirection();
        if (col) {
            result = [...result].sort((a, b) => {
                let valA: string;
                let valB: string;
                if (col === 'lastChange') {
                    valA = a.revInfo.lastChange ?? '';
                    valB = b.revInfo.lastChange ?? '';
                } else {
                    valA = (a[col] as string | undefined) ?? '';
                    valB = (b[col] as string | undefined) ?? '';
                }
                const cmp = valA.localeCompare(valB);
                return dir === 'asc' ? cmp : -cmp;
            });
        }

        return result;
    }
}
