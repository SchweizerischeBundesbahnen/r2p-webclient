import { signal, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de';
import { ReadTrainPage } from './read-train-page';
import { ReadTrainPageState } from './read-train-page.state';
import { Branch } from '../../shared/models/api.models';

registerLocaleData(localeDeCh, 'de-CH');

const BRANCH: Branch = {
    branchId: 'branch-1',
    branchName: 'SBB-main',
    business: {
        trainNumber: 'IC 1234',
        operationalDay: '2026-05-26',
    },
    technical: {
        version: 'v-001',
        branchState: 'open',
        timestamp: '2026-05-26T10:30:00Z',
        comment: 'initial version',
        mainBranch: true,
        owner: 'SBB',
    },
};

function createFakeState(branch?: Branch) {
    const value = branch ? { branch, train: {} } : undefined;
    return {
        trainId: signal<string | undefined>(undefined),
        branchId: signal<string | undefined>(undefined),
        isJsonModalOpen: false,
        toggleIsJsonModalOpen: () => {},
        trainAndBranch: {
            value: signal(value),
            error: signal(undefined),
            isLoading: signal(false),
        },
    };
}

function createComponent(locale: string, branch?: Branch) {
    const fakeState = createFakeState(branch);
    TestBed.configureTestingModule({
        providers: [
            provideRouter([]),
            { provide: LOCALE_ID, useValue: locale },
        ],
    });
    // ReadTrainPageState is declared in the component's own providers array,
    // so it must be overridden at the component level, not at the module level.
    TestBed.overrideComponent(ReadTrainPage, {
        set: { providers: [{ provide: ReadTrainPageState, useValue: fakeState }] },
    });
    const fixture = TestBed.createComponent(ReadTrainPage);
    fixture.componentRef.setInput('trainId', 'train-1');
    fixture.componentRef.setInput('branchId', 'branch-1');
    fixture.detectChanges();
    return fixture;
}

describe('ReadTrainPage – date formatting', () => {
    afterEach(() => TestBed.resetTestingModule());

    describe('operationalDay with mediumDate', () => {
        it('formats correctly for en-US', () => {
            const fixture = createComponent('en-US', BRANCH);
            const text = fixture.nativeElement.querySelector('#detail-op-day').textContent.trim();
            expect(text).toBe('May 26, 2026');
        });

        it('formats correctly for de-CH', () => {
            const fixture = createComponent('de-CH', BRANCH);
            const text = fixture.nativeElement.querySelector('#detail-op-day').textContent.trim();
            expect(text).toBe('26.05.2026');
        });

        it('shows "–" as fallback when branch is not loaded', () => {
            const fixture = createComponent('en-US');
            // operationalDay is undefined → DatePipe returns null → fallback '–' is shown
            const text = fixture.nativeElement.querySelector('#detail-op-day').textContent.trim();
            expect(text).toBe('–');
        });
    });

    describe('timestamp with short', () => {
        it('formats correctly for en-US', () => {
            const fixture = createComponent('en-US', BRANCH);
            const text = fixture.nativeElement
                .querySelector('#detail-timestamp')
                .textContent.trim();
            expect(text).toMatch(/5\/26\/26/);
        });

        it('formats correctly for de-CH', () => {
            const fixture = createComponent('de-CH', BRANCH);
            const text = fixture.nativeElement
                .querySelector('#detail-timestamp')
                .textContent.trim();
            expect(text).toMatch(/26\.05\.26/);
        });

        it('shows empty when branch is not loaded', () => {
            const fixture = createComponent('en-US');
            const text = fixture.nativeElement
                .querySelector('#detail-timestamp')
                .textContent.trim();
            expect(text).toBe('');
        });
    });
});

