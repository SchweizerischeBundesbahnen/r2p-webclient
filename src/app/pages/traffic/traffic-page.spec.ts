import { signal, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de';
import { TrafficPage } from './traffic-page';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { TrainListElement } from '../../shared/models/api.models';

registerLocaleData(localeDeCh, 'de-CH');

const TRAIN_LIST_ELEMENT: TrainListElement = {
    trainId: 'train-1',
    mainTimestamp: '2026-05-26T10:30:00Z',
    partners: ['SBB', 'BLS'],
    branches: [
        {
            branchId: 'branch-1',
            branchName: 'SBB-main',
            business: { trainNumber: 'IC 1234', operationalDay: '2026-05-26' },
            technical: {
                version: 'v-001',
                branchState: 'open',
                timestamp: '2026-05-26T10:30:00Z',
                comment: 'initial',
                mainBranch: true,
                owner: 'SBB',
            },
        },
        {
            branchId: 'branch-2',
            branchName: 'BLS-variant',
            business: { trainNumber: 'IC 1234', operationalDay: '2026-05-26' },
            technical: {
                version: 'v-002',
                branchState: 'merge_requested',
                timestamp: '2026-05-26T14:00:00Z',
                comment: 'proposed change',
                mainBranch: false,
                owner: 'BLS',
            },
        },
    ],
};

const TRAIN_WITH_DETAILS: TrainWithDetails = {
    listElement: TRAIN_LIST_ELEMENT,
    details: null,
};

function createFakeState(value?: TrainWithDetails) {
    return {
        trainId: signal<string | undefined>(undefined),
        newVariantModalIsOpen: signal(false),
        toggleIsNewVariantModalOpen: () => {},
        trainMainBranch: {
            value: signal(value),
            error: signal(undefined),
            isLoading: signal(false),
        },
    };
}

function createComponent(locale: string, value?: TrainWithDetails) {
    const fakeState = createFakeState(value);
    TestBed.configureTestingModule({
        providers: [
            provideRouter([]),
            { provide: LOCALE_ID, useValue: locale },
        ],
    });
    TestBed.overrideComponent(TrafficPage, {
        set: { providers: [{ provide: TrafficPageState, useValue: fakeState }] },
    });
    const fixture = TestBed.createComponent(TrafficPage);
    fixture.componentRef.setInput('trainId', 'train-1');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('TrafficPage – date formatting', () => {
    afterEach(() => TestBed.resetTestingModule());

    describe('operationalDay (mediumDate)', () => {
        it('formats correctly for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            expect(el.querySelector('#detail-op-day')!.textContent!.trim()).toBe('May 26, 2026');
        });

        it('formats correctly for de-CH', () => {
            const el = createComponent('de-CH', TRAIN_WITH_DETAILS);
            expect(el.querySelector('#detail-op-day')!.textContent!.trim()).toBe('26.05.2026');
        });

        it('shows "–" when no data is loaded', () => {
            const el = createComponent('en-US');
            expect(el.querySelector('#detail-op-day')!.textContent!.trim()).toBe('–');
        });
    });

    describe('departureTime and arrivalTime (shortTime)', () => {
        it('formats departure time for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            // TODO: departureTime is hardcoded stub – just verify shortTime format (no seconds)
            expect(el.querySelector('#detail-dep-time')!.textContent!.trim()).toMatch(/\d{1,2}:\d{2}/);
        });

        it('formats arrival time for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            expect(el.querySelector('#detail-arr-time')!.textContent!.trim()).toMatch(/\d{1,2}:\d{2}/);
        });
    });

    describe('variant lastChange (short)', () => {
        it('formats variant timestamps correctly for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            const branchMeta = el.querySelectorAll('.branch-meta');
            // Two branches – check both contain a formatted date
            expect(branchMeta[0].textContent).toMatch(/5\/26\/26/);
            expect(branchMeta[1].textContent).toMatch(/5\/26\/26/);
        });

        it('formats variant timestamps correctly for de-CH', () => {
            const el = createComponent('de-CH', TRAIN_WITH_DETAILS);
            const branchMeta = el.querySelectorAll('.branch-meta');
            expect(branchMeta[0].textContent).toMatch(/26\.05\.26/);
            expect(branchMeta[1].textContent).toMatch(/26\.05\.26/);
        });
    });
});

