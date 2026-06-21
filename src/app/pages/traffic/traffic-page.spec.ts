import { LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de';
import { TrafficPage } from './traffic-page';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { TimingType, Train, TrainListElement } from '../../shared/models/api.models';
import { SettingsService } from '../../core/settings/settings.service';

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

const TRAIN_DETAILS: Train = {
    id: 'train-1-2-3',
    name: 'IC 1234',
    startdate: '2026-05-26',
    journey: {
        journeylocations: [
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8503000',
                        name: 'Zürich HB',
                    },
                ],
                activities: [
                    {
                        id: 'a1-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Departure,
                                duration: 'PT8H12M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            path: {
                                id: 'a1-01-002',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                            capabilityFeatures: [],
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8502204',
                        name: 'Lenzburg',
                    },
                ],
                activities: [
                    {
                        id: 'a2-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT8H25M',
                                focus: 'planning',
                            },
                            {
                                type: TimingType.Departure,
                                duration: 'PT8H27M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a2-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-8507000',
                        name: 'Bern',
                    },
                ],
                activities: [
                    {
                        id: 'a5-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: TimingType.Arrival,
                                duration: 'PT9H16M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        capability: {
                            type: 'path',
                            capabilityFeatures: [],
                            path: {
                                id: 'a5-01-001',
                                length: 1500,
                                weight: 3500,
                                maxSpeed: 250,
                            },
                        },
                        relations: [],
                    },
                ],
            },
        ],
    },
};

const TRAIN_WITH_DETAILS: TrainWithDetails = {
    listElement: TRAIN_LIST_ELEMENT,
    details: TRAIN_DETAILS,
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
        trainMainBranch: {
            value: signal(value),
            error: signal(undefined),
            isLoading: signal(false),
            reload: () => {
                void 0;
            },
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
            { provide: SettingsService, useValue: settingsService },
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
            expect(el.querySelector('#train-name')!.textContent).toContain('May 26, 2026');
        });

        it('formats correctly for de-CH', () => {
            const el = createComponent('de-CH', TRAIN_WITH_DETAILS);
            expect(el.querySelector('#train-name')!.textContent).toContain('26.05.2026');
        });

        it('shows no train header card when no data is loaded', () => {
            const el = createComponent('en-US');
            expect(el.querySelector('#train-header-card')).toBeNull();
        });
    });

    describe('departureTime and arrivalTime (HH:mm, UTC)', () => {
        it('formats departure time as 24h UTC for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            // earliest departure PT8H12M on operationalDay → 08:12 UTC, unshifted
            expect(el.querySelector('#detail-dep-time')!.textContent!.trim()).toBe('08:12');
        });

        it('formats departure time identically for de-CH', () => {
            const el = createComponent('de-CH', TRAIN_WITH_DETAILS);
            expect(el.querySelector('#detail-dep-time')!.textContent!.trim()).toBe('08:12');
        });

        it('formats arrival time as 24h UTC for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            // latest arrival PT9H16M → 09:16 UTC
            expect(el.querySelector('#detail-arr-time')!.textContent!.trim()).toBe('09:16');
        });
    });

    describe('variant lastChange (mediumDate + 24h time)', () => {
        it('formats variant timestamps correctly for en-US', () => {
            const el = createComponent('en-US', TRAIN_WITH_DETAILS);
            const branchMeta = el.querySelectorAll('.branch-meta');
            // main branch (SBB, 10:30) first, then BLS variant (14:00)
            expect(branchMeta[0].textContent).toMatch(/May 26, 2026/);
            expect(branchMeta[0].textContent).toMatch(/10:30/);
            expect(branchMeta[1].textContent).toMatch(/14:00/);
        });

        it('formats variant timestamps correctly for de-CH', () => {
            const el = createComponent('de-CH', TRAIN_WITH_DETAILS);
            const branchMeta = el.querySelectorAll('.branch-meta');
            expect(branchMeta[0].textContent).toMatch(/26\.05\.2026/);
            expect(branchMeta[0].textContent).toMatch(/10:30/);
            expect(branchMeta[1].textContent).toMatch(/14:00/);
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
                        technical: {
                            ...TRAIN_LIST_ELEMENT.branches[1].technical,
                            branchState: 'open',
                        },
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
                        technical: {
                            ...TRAIN_LIST_ELEMENT.branches[1].technical,
                            branchState: 'open',
                        },
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
        expect(branchActions[1].textContent).toContain('Accept');
        expect(branchActions[1].textContent).toContain('Reject');
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
        const branchNames = Array.from(el.querySelectorAll('.branch-name')).map((e) =>
            e.textContent?.trim(),
        );
        expect(branchNames[0]).toContain('SBB-main'); // main first
        expect(branchNames[1]).toContain('SOB-variant'); // 16:00 > 14:00
        expect(branchNames[2]).toContain('BLS-variant'); // 14:00
    });
});

describe('TrafficPage – Share Train button visibility', () => {
    afterEach(() => TestBed.resetTestingModule());

    function trainWithPartners(partners: string[] | undefined): TrainWithDetails {
        return {
            listElement: { ...TRAIN_LIST_ELEMENT, partners },
            details: null,
        };
    }

    function findShareButton(el: HTMLElement): HTMLButtonElement | undefined {
        return Array.from(el.querySelectorAll<HTMLButtonElement>('.btn-group button')).find((b) =>
            b.textContent?.includes('Share train'),
        );
    }

    it('shows Share Train button when at least one other org has not been shared with', () => {
        // SBB logged in, BLS shared but SOB not → button visible
        const el = createComponent('en-US', trainWithPartners(['BLS']), 'SBB');
        expect(findShareButton(el)).toBeDefined();
    });

    it('hides Share Train button when all other orgs are already shared', () => {
        // SBB logged in, all other orgs shared → button hidden
        const el = createComponent('en-US', trainWithPartners(['BLS', 'SOB', 'TI', 'DBF', 'DBC', 'DBCNL', 'SBBC', 'SBBCI', 'RCA', 'MEV']), 'SBB');
        expect(findShareButton(el)).toBeUndefined();
    });

    it('shows Share Train button when partners is undefined or empty', () => {
        const elUndefined = createComponent('en-US', trainWithPartners(undefined), 'SBB');
        expect(findShareButton(elUndefined)).toBeDefined();

        TestBed.resetTestingModule();

        const elEmpty = createComponent('en-US', trainWithPartners([]), 'SBB');
        expect(findShareButton(elEmpty)).toBeDefined();
    });

    it('does not count own org as an unshared partner', () => {
        // SBB logged in, all other orgs present — button hidden because SBB is the current org
        const el = createComponent('en-US', trainWithPartners(['BLS', 'SOB', 'TI', 'DBF', 'DBC', 'DBCNL', 'SBBC', 'SBBCI', 'RCA', 'MEV']), 'SBB');
        expect(findShareButton(el)).toBeUndefined();
    });
});

describe('TrafficPage – Delete Train button visibility', () => {
    afterEach(() => TestBed.resetTestingModule());

    function findDeleteButton(el: HTMLElement): HTMLButtonElement | undefined {
        return Array.from(el.querySelectorAll<HTMLButtonElement>('.btn-group button')).find((b) =>
            b.textContent?.includes('Delete train'),
        );
    }

    it('shows Delete Train button when current org is Lead RU (main branch owner)', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'SBB');
        expect(findDeleteButton(el)).toBeDefined();
    });

    it('hides Delete Train button when current org is not Lead RU', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'BLS');
        expect(findDeleteButton(el)).toBeUndefined();
    });

    it('hides Delete Train button when there is no main branch', () => {
        const trainWithNoBranches: TrainWithDetails = {
            listElement: { ...TRAIN_LIST_ELEMENT, branches: [] },
            details: null,
        };
        const el = createComponent('en-US', trainWithNoBranches, 'SBB');
        expect(findDeleteButton(el)).toBeUndefined();
    });
});

describe('TrafficPage – edit button visibility', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('shows Edit button only for own branches', () => {
        // SBB is logged in → only SBB-main branch (row 0) should show the edit icon-btn
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'SBB');
        const rows = el.querySelectorAll('.branch-row');
        expect(rows[0].querySelector('.icon-btn')).not.toBeNull();
        expect(rows[1].querySelector('.icon-btn')).toBeNull();
    });

    it('shows Edit button for BLS branch when logged in as BLS', () => {
        const el = createComponent('en-US', TRAIN_WITH_DETAILS, 'BLS');
        const rows = el.querySelectorAll('.branch-row');
        expect(rows[0].querySelector('.icon-btn')).toBeNull();
        expect(rows[1].querySelector('.icon-btn')).not.toBeNull();
    });
});
