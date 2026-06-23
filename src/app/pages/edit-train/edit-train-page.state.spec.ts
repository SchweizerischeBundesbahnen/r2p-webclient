import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EditTrainPageState } from './edit-train-page.state';
import { Settings, SettingsService } from '../../core/settings/settings.service';
import { Branch } from '../../shared/models/api.models';

function settingsFor(organization: string): Settings {
    return { serverUrl: '', organization, authority: '', clientId: '', scope: '' };
}

const VALID_BRANCH: Branch = {
    branchId: 'branch-1',
    branchName: 'SBB-main',
    business: {
        trainNumber: 'IC 1234',
        operationalDay: '2026-05-26',
    },
    technical: {
        version: 'version-1',
        branchState: 'open',
        timestamp: '2026-05-26T10:00:00Z',
        comment: 'initial',
        mainBranch: true,
    },
};

describe('EditTrainPageState', () => {
    let state: EditTrainPageState;
    let httpController: HttpTestingController;
    let settings: ReturnType<typeof signal<Settings>>;

    beforeEach(() => {
        settings = signal<Settings>(settingsFor('SBB'));
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: SettingsService, useValue: { settings: settings.asReadonly() } },
                EditTrainPageState,
            ],
        });
        state = TestBed.runInInjectionContext(() => TestBed.inject(EditTrainPageState));
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpController.verify();
        TestBed.resetTestingModule();
    });

    function flushTrainListElement(partners: string[] = [], branches: Branch[] = []): void {
        httpController
            .expectOne((r) => r.url.match(/\/v1\/trains\/[^/]+$/) !== null)
            .flush({ trainId: 'train-1', mainTimestamp: '', partners, branches });
    }

    function mainBranchOwnedBy(owner: string): Branch {
        return { ...VALID_BRANCH, technical: { ...VALID_BRANCH.technical, owner, mainBranch: true } };
    }

    it('populates the form when the API returns a valid operationalDay', async () => {
        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        // tick() flushes pending effects so that rxResource reacts to the signal changes
        // and issues the HTTP request, which can then be intercepted below.
        TestBed.tick();

        flushTrainListElement(['BLS']);
        httpController
            .expectOne((r) => r.url.includes('/branches/branch-1'))
            .flush(VALID_BRANCH);
        httpController
            .expectOne((r) => r.url.includes('/versions/version-1'))
            .flush({});

        await TestBed.inject(() => state.branch.isLoading(), { optional: true });

        expect(state.editTrainForm.operationalDay().value()).toBe('2026-05-26');
        expect(state.editTrainForm.trainNumber().value()).toBe('IC 1234');
    });

    it('exposes partners from trainListElement', async () => {
        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        TestBed.tick();

        flushTrainListElement(['SBB', 'BLS', 'SOB']);
        httpController.expectOne((r) => r.url.includes('/branches/branch-1')).flush(VALID_BRANCH);
        httpController.expectOne((r) => r.url.includes('/versions/version-1')).flush({});

        await Promise.resolve();
        TestBed.tick();

        expect(state.partners()).toEqual(['SBB', 'BLS', 'SOB']);
    });

    it('exposes the current organisation from SettingsService', () => {
        expect(state.currentOrg()).toBe('SBB');
        settings.set(settingsFor('BLS'));
        expect(state.currentOrg()).toBe('BLS');
    });

    it('isLeadRu is false while train data is still loading', () => {
        expect(state.isLeadRu()).toBe(false);
    });

    it('isLeadRu is true when the current org owns the main branch', async () => {
        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        TestBed.tick();

        flushTrainListElement([], [mainBranchOwnedBy('SBB')]);
        httpController.expectOne((r) => r.url.includes('/branches/branch-1')).flush(VALID_BRANCH);
        httpController.expectOne((r) => r.url.includes('/versions/version-1')).flush({});

        await Promise.resolve();
        TestBed.tick();

        expect(state.isLeadRu()).toBe(true);
    });

    it('isLeadRu is false when another org owns the main branch', async () => {
        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        TestBed.tick();

        flushTrainListElement([], [mainBranchOwnedBy('BLS')]);
        httpController.expectOne((r) => r.url.includes('/branches/branch-1')).flush(VALID_BRANCH);
        httpController.expectOne((r) => r.url.includes('/versions/version-1')).flush({});

        await Promise.resolve();
        TestBed.tick();

        expect(state.isLeadRu()).toBe(false);
    });

    it('sets the resource into error state when the API returns an invalid operationalDay', async () => {
        const invalidBranch: Branch = {
            ...VALID_BRANCH,
            business: { ...VALID_BRANCH.business, operationalDay: '2026-02-30' },
        };

        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        // First tick: rxResource reacts to the signal changes and issues the HTTP request.
        TestBed.tick();

        flushTrainListElement();
        httpController
            .expectOne((r) => r.url.includes('/branches/branch-1'))
            .flush(invalidBranch);

        // Allow microtasks to settle (rxResource processes the error asynchronously),
        // then tick again so Angular propagates it into branch.error().
        await Promise.resolve();
        TestBed.tick();

        expect(state.branch.error()).toBeInstanceOf(Error);
        expect((state.branch.error() as Error).message).toBe('Invalid ISO date "2026-02-30"');
    });

    it('sets the resource into error state when operationalDay is a date-time string', async () => {
        const invalidBranch: Branch = {
            ...VALID_BRANCH,
            business: { ...VALID_BRANCH.business, operationalDay: '2026-05-26T10:00:00Z' },
        };

        state.trainId.set('train-1');
        state.branchId.set('branch-1');
        // First tick: rxResource reacts to the signal changes and issues the HTTP request.
        TestBed.tick();

        flushTrainListElement();
        httpController
            .expectOne((r) => r.url.includes('/branches/branch-1'))
            .flush(invalidBranch);

        // Allow microtasks to settle, then tick so Angular propagates the error.
        await Promise.resolve();
        TestBed.tick();

        expect(state.branch.error()).toBeInstanceOf(Error);
        expect((state.branch.error() as Error).message).toBe(
            'Invalid ISO date "2026-05-26T10:00:00Z"',
        );
    });
});



