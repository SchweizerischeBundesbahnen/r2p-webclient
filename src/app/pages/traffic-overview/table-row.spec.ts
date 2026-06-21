import { Component, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de';
import { TableRow, TrainRow } from './table-row';

registerLocaleData(localeDeCh, 'de-CH');

const TRAIN_ROW: TrainRow = {
    id: '1',
    trainNumber: 'IC 1234',
    operationalDay: '2026-05-26',
    // Schedule times are UTC instants (operationalDay + ISO duration). The 'UTC'
    // DatePipe arg renders the stored wall-clock unchanged, so both locales show 08:30.
    startTime: '2026-05-26T08:30:00.000Z',
    endTime: '2026-05-26T10:00:00.000Z',
    start: 'Zürich HB',
    end: 'Basel SBB',
    partners: ['SBB'],
    revInfo: { lastChange: '2026-05-26T10:30:00', version: 'v-001' },
    trainData: {},
};

// TableRow uses selector tr[appTrainRow], so it must be placed inside a table.
@Component({
    template: `<table><tbody><tr appTrainRow [train]="train"></tr></tbody></table>`,
    imports: [TableRow],
})
class TestHostComponent {
    train = TRAIN_ROW;
}

function createHost(locale: string) {
    TestBed.configureTestingModule({
        providers: [{ provide: LOCALE_ID, useValue: locale }],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('TableRow – date formatting', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('formats operationalDay with mediumDate for en-US', () => {
        const el = createHost('en-US');
        // 'UTC' is passed to DatePipe in production code, so the date is stable regardless of local timezone
        expect(el.querySelectorAll('td')[2].textContent?.trim()).toBe('May 26, 2026');
    });

    it('formats operationalDay with mediumDate for de-CH', () => {
        const el = createHost('de-CH');
        expect(el.querySelectorAll('td')[2].textContent?.trim()).toBe('26.05.2026');
    });

    it('formats startTime as 24h UTC for en-US', () => {
        const el = createHost('en-US');
        expect(el.querySelectorAll('td')[1].textContent).toMatch(/08:30/);
    });

    it('formats startTime as 24h UTC for de-CH (identical to en-US)', () => {
        const el = createHost('de-CH');
        expect(el.querySelectorAll('td')[1].textContent).toMatch(/08:30/);
    });

    it('renders the merged route cell with start, end, departure and arrival', () => {
        const el = createHost('en-US');
        const route = el.querySelectorAll('td')[1].textContent ?? '';
        expect(route).toContain('Zürich HB');
        expect(route).toContain('Basel SBB');
        expect(route).toMatch(/08:30/);
        expect(route).toMatch(/10:00/);
    });

    it('truncates the version to the first 7 characters', () => {
        TestBed.configureTestingModule({
            providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.componentInstance.train = {
            ...TRAIN_ROW,
            revInfo: { ...TRAIN_ROW.revInfo, version: 'abcdef1234567890' },
        };
        fixture.detectChanges();
        const lastChangeCell = (fixture.nativeElement as HTMLElement).querySelectorAll('td')[4];
        expect(lastChangeCell.textContent).toContain('abcdef1');
        expect(lastChangeCell.textContent).not.toContain('abcdef1234567890');
    });

    it('formats lastChange as mediumDate + 24h time for en-US', () => {
        const el = createHost('en-US');
        const text = el.querySelectorAll('td')[4].textContent ?? '';
        expect(text).toMatch(/May 26, 2026/);
        expect(text).toMatch(/10:30/);
    });

    it('formats lastChange as mediumDate + 24h time for de-CH', () => {
        const el = createHost('de-CH');
        const text = el.querySelectorAll('td')[4].textContent ?? '';
        expect(text).toMatch(/26\.05\.2026/);
        expect(text).toMatch(/10:30/);
    });
});

