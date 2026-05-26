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
    // Use a timezone-neutral time string (no Z suffix) so DatePipe interprets
    // it as local time regardless of the environment's timezone offset.
    startTime: '2026-05-26T08:30:00',
    endTime: '2026-05-26T10:00:00',
    start: 'Zürich HB',
    end: 'Basel SBB',
    partners: ['SBB'],
    revInfo: { lastChange: '2026-05-26T10:30:00Z', version: 'v-001' },
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
        expect(el.querySelectorAll('td')[3].textContent?.trim()).toBe('May 26, 2026');
    });

    it('formats operationalDay with mediumDate for de-CH', () => {
        const el = createHost('de-CH');
        expect(el.querySelectorAll('td')[3].textContent?.trim()).toBe('26.05.2026');
    });

    it('formats startTime with shortTime for en-US', () => {
        const el = createHost('en-US');
        expect(el.querySelectorAll('td')[1].textContent).toMatch(/8:30\s*AM/);
    });

    it('formats startTime with shortTime for de-CH', () => {
        const el = createHost('de-CH');
        expect(el.querySelectorAll('td')[1].textContent).toMatch(/08:30/);
    });

    it('formats lastChange with short for en-US', () => {
        const el = createHost('en-US');
        expect(el.querySelectorAll('td')[5].textContent).toMatch(/5\/26\/26/);
    });

    it('formats lastChange with short for de-CH', () => {
        const el = createHost('de-CH');
        expect(el.querySelectorAll('td')[5].textContent).toMatch(/26\.05\.26/);
    });
});

