import { TestBed } from '@angular/core/testing';
import { TrafficOverviewTableService } from './traffic-overview-table.service';
import { TrainRow } from './table-row';

const TRAIN_A: TrainRow = {
    id: '1',
    trainNumber: 'IC 1234',
    operationalDay: '2026-04-10',
    partners: ['SBB'],
    start: 'Zürich HB',
    startTime: '',
    end: 'Basel SBB',
    endTime: '',
    revInfo: { lastChange: '2026-03-01T10:00:00Z', version: 'v-001' },
    trainData: {},
};

const TRAIN_B: TrainRow = {
    id: '2',
    trainNumber: 'S 2050',
    operationalDay: '2026-05-20',
    partners: ['BLS'],
    start: 'St. Gallen',
    startTime: '',
    end: 'Romanshorn',
    endTime: '',
    revInfo: { lastChange: '2026-04-08T13:00:00Z', version: 'v-020' },
    trainData: {},
};

const TRAIN_C: TrainRow = {
    id: '3',
    trainNumber: 'RE 3000',
    operationalDay: '2026-06-15',
    partners: ['SOB'],
    start: 'Bern',
    startTime: '',
    end: 'Thun',
    endTime: '',
    revInfo: { lastChange: '2026-05-01T08:00:00Z', version: 'v-005' },
    trainData: {},
};

const ALL_TRAINS = [TRAIN_A, TRAIN_B, TRAIN_C];

describe('TrafficOverviewTableFilterService', () => {

    function createService(): TrafficOverviewTableService {
        return TestBed.runInInjectionContext(() => new TrafficOverviewTableService());
    }

    it('returns all items when no filter is set', () => {
        const service = createService();

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual(ALL_TRAINS);
    });

    it('returns empty array when items is undefined', () => {
        const service = createService();

        const result = service.applyFilterOn(undefined);

        expect(result).toEqual([]);
    });

    it('filters by train number (case-insensitive, partial match)', () => {
        const service = createService();
        service.trainNumber.set('ic');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([TRAIN_A]);
    });

    it('filters by operationalDayFrom – excludes trains before the date', () => {
        const service = createService();
        service.operationalDayFrom.set('2026-05-01');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([TRAIN_B, TRAIN_C]);
    });

    it('filters by operationalDayTo – excludes trains after the date', () => {
        const service = createService();
        service.operationalDayTo.set('2026-05-31');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([TRAIN_A, TRAIN_B]);
    });

    it('filters by both operationalDayFrom and operationalDayTo', () => {
        const service = createService();
        service.operationalDayFrom.set('2026-05-01');
        service.operationalDayTo.set('2026-05-31');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([TRAIN_B]);
    });

    it('combines trainNumber and date filters', () => {
        const service = createService();
        service.trainNumber.set('s');
        service.operationalDayFrom.set('2026-05-01');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([TRAIN_B]);
    });

    it('returns empty array when no items match the filter', () => {
        const service = createService();
        service.trainNumber.set('NONEXISTENT');

        const result = service.applyFilterOn(ALL_TRAINS);

        expect(result).toEqual([]);
    });

    it('clearFilters resets all filters and returns all items', () => {
        const service = createService();
        service.trainNumber.set('IC');
        service.operationalDayFrom.set('2026-05-01');
        service.operationalDayTo.set('2026-06-01');

        service.clearFilters();

        expect(service.trainNumber()).toBe('');
        expect(service.operationalDayFrom()).toBe('');
        expect(service.operationalDayTo()).toBe('');
        expect(service.applyFilterOn(ALL_TRAINS)).toEqual(ALL_TRAINS);
    });
});

