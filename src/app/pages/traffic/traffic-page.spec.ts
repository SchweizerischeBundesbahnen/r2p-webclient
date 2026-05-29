import { signal, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de';
import { TrafficPage } from './traffic-page';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { TrainListElement } from '../../shared/models/api.models';
import { SettingsService } from '../../settings/settings.service';

registerLocaleData(localeDeCh, 'de-CH');

const TRAIN_LIST_ELEMENT: TrainListElement = {
    trainId: 'train-1',
    mainTimestamp: '2026-05-26T10:30:00',
    partners: ['SBB', 'BLS'],
    branches: [
        {
            branchId: 'branch-1',
            branchName: 'SBB-main',
            business: { trainNumber: 'IC 1234', operationalDay: '2026-05-26' },
            technical: {
                version: 'v-001',
                branchState: 'open',
                timestamp: '2026-05-26T10:30:00',
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
                timestamp: '2026-05-26T14:00:00',
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

function makeSettingsService(organization: string): SettingsService {
    return {
        settings: signal({
            serverUrl: 'http://localhost:8080',
            organization,
            authority: '',
            clientId: '',
            scope: '',
        }),
    } as unknown as SettingsService;
}

function createFakeState(value?: TrainWithDetails) {
    return {
        trainId: signal<string | undefined>(undefined),
        newVariantModalIsOpen: signal(false),
        toggleIsNewVariantModalOpen: () => { void 0; },
        trainMainBranch: {
            value: signal(value),
            error: signal(undefined),
            isLoading: signal(false),
            reload: () => { void 0; },
        },
    };
}

function createComponent(locale: string, value?: TrainWithDetails, organization = 'SBB') {
    const fakeState = createFakeState(value);
    const settingsService = makeSettingsService(organization);
    TestBed.configureTestingModule({
        providers: [
            provideRouter([]),
            { provide: LOCALE_ID, useValue: locale },
            { provide: TrafficPageState, useValue: fakeState },
            { provide: SettingsService, useValue: settingsService },
        ],
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

        it('shows "-" when no data is loaded', () => {
            const el = createComponent('en-US');
            expect(el.querySelector('#detail-op-day')!.textContent!.trim()).toBe('-');
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

describe('TrafficPage – merge action buttons', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('shows Merge Request button for own open non-main branch', () => {
        const trainWithOpenBranch: TrainWithDetails = {
            listElement: {
                ...TRAIN_LIST_ELEMENT,
                branches: [
                    TRAIN_LIST_ELEMENT.branches[0],
                    {
                        ...TRAIN_LIST_ELEMENT.branches[1],
                        technical: { ...TRAIN_LIST_ELEMENT.branches[1].technical, branchState: 'open' },
                    },
                ],
            },
            details: null,
        };
        const el = createComponent('en-US', trainWithOpenBranch, 'BLS');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[1].textContent).toContain('Propose Variant');
    });

    it('does not show Merge Request button for other partner branches', () => {
        const trainWithOpenBranch: TrainWithDetails = {
            listElement: {
                ...TRAIN_LIST_ELEMENT,
                branches: [
                    TRAIN_LIST_ELEMENT.branches[0],
                    {
                        ...TRAIN_LIST_ELEMENT.branches[1],
                        technical: { ...TRAIN_LIST_ELEMENT.branches[1].technical, branchState: 'open' },
                    },
                ],
            },
            details: null,
        };
        const el = createComponent('en-US', trainWithOpenBranch, 'SBB');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[1].textContent).not.toContain('Propose Variant');
    });

    it('shows Accept and Reject buttons for Lead RU when branch is merge_requested', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'SBB');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[1].textContent).toContain('Accept Variant');
        expect(branchActions[1].textContent).toContain('Reject Variant');
    });

    it('does not show Accept and Reject buttons for non-Lead RU', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'BLS');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[1].textContent).not.toContain('Accept Variant');
        expect(branchActions[1].textContent).not.toContain('Reject Variant');
    });

    it('does not show Accept/Reject for main branch even if owned by Lead RU', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'SBB');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[0].textContent).not.toContain('Accept Variant');
        expect(branchActions[0].textContent).not.toContain('Reject Variant');
    });
});

describe('TrafficPage – variant sort order', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('shows main branch first, then other branches descending by timestamp', () => {
        const trainWithMultipleBranches: TrainWithDetails = {
            listElement: {
                ...TRAIN_LIST_ELEMENT,
                branches: [
                    {
                        branchId: 'branch-3',
                        branchName: 'SOB-variant',
                        business: { trainNumber: 'IC 1234', operationalDay: '2026-05-26' },
                        technical: {
                            version: 'v-003',
                            branchState: 'open',
                            timestamp: '2026-05-26T16:00:00',
                            comment: '',
                            mainBranch: false,
                            owner: 'SOB',
                        },
                    },
                    TRAIN_LIST_ELEMENT.branches[1], // BLS, 14:00
                    TRAIN_LIST_ELEMENT.branches[0], // SBB main, 10:30
                ],
            },
            details: null,
        };
        const el = createComponent('en-US', trainWithMultipleBranches, 'SBB');
        const branchNames = Array.from(el.querySelectorAll('.branch-name')).map(
            (e) => e.textContent?.trim(),
        );
        expect(branchNames[0]).toContain('SBB-main');    // main first
        expect(branchNames[1]).toContain('SOB-variant'); // 16:00 > 14:00
        expect(branchNames[2]).toContain('BLS-variant'); // 14:00
    });
});

describe('TrafficPage – edit button visibility', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('shows Edit button only for own branches', () => {
        // SBB is logged in → only SBB-main branch should show Edit
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'SBB');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[0].textContent).toContain('Edit');
        expect(branchActions[1].textContent).not.toContain('Edit');
    });

    it('shows Edit button for BLS branch when logged in as BLS', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'BLS');
        const branchActions = el.querySelectorAll('.branch-actions');
        expect(branchActions[0].textContent).not.toContain('Edit');
        expect(branchActions[1].textContent).toContain('Edit');
    });
});

