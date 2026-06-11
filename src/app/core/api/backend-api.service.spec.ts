import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BackendApiService, minimalTrain } from './backend-api.service';
import { Train } from '../../shared/models/api.models';
import { SettingsService, ORGANIZATION_OPTIONS } from '../settings/settings.service';
import { vi } from 'vitest';

function makeSettingsService(serverUrl = 'https://settings.example.com', organization = ORGANIZATION_OPTIONS[0].name): SettingsService {
    return {
        settings: vi.fn().mockReturnValue({ serverUrl, organization, authority: '', clientId: '', scope: '' }),
        hasConfiguredSettings: vi.fn().mockReturnValue(true),
        save: vi.fn(),
        load: vi.fn(),
    } as unknown as SettingsService;
}

describe('BackendApiService', () => {
    let service: BackendApiService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                BackendApiService,
                { provide: SettingsService, useValue: makeSettingsService() },
            ],
        });
        service = TestBed.inject(BackendApiService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpController.verify());

    describe('createTrain', () => {
        it('throws for an invalid operationalDay before making an HTTP request', () => {
            expect(() => service.createTrain('IC 1234', '2026-02-30', 'comment', minimalTrain.journey!)).toThrow(
                'Invalid ISO date "2026-02-30"',
            );
            httpController.expectNone({});
        });

        it('throws for a date-time string instead of a date-only string', () => {
            expect(() =>
                service.createTrain('IC 1234', '2026-05-26T10:00:00', 'comment', minimalTrain.journey!),
            ).toThrow('Invalid ISO date "2026-05-26T10:00:00"');
            httpController.expectNone({});
        });

        it('makes an HTTP request for a valid operationalDay', () => {
            service.createTrain('IC 1234', '2026-05-26', 'comment', minimalTrain.journey!).subscribe();

            const req = httpController.expectOne((r) => r.url.endsWith('/v1/trains'));
            expect(req.request.method).toBe('POST');
            expect(req.request.body.startdate).toBe('2026-05-26');
            req.flush({});
        });

        it('sets the Token header and base URL from settings', () => {
            service.createTrain('IC 1234', '2026-05-26', 'comment', minimalTrain.journey!).subscribe();
            const req = httpController.expectOne((r) => r.url.endsWith('/v1/trains'));
            expect(req.request.headers.get('Token')).toBe(ORGANIZATION_OPTIONS[0].name);
            expect(req.request.url).toContain('https://settings.example.com');
            req.flush({});
        });
    });

    describe('listTrains', () => {
        it('sets the Token header from settings organization', () => {
            service.listTrains().subscribe();
            const req = httpController.expectOne((r) => r.url.endsWith('/v1/trains'));
            expect(req.request.method).toBe('GET');
            expect(req.request.headers.get('Token')).toBe(ORGANIZATION_OPTIONS[0].name);
            req.flush([]);
        });
    });

    describe('shareTrain', () => {
        it('POST /v1/trains/{trainId}/share with correct query params', () => {
            service.shareTrain('train-uuid', 'BLS', 'Sharing reason').subscribe();

            const req = httpController.expectOne(r =>
                r.url.includes('/v1/trains/train-uuid/share') && r.method === 'POST'
            );
            expect(req.request.params.get('shareWith')).toBe('BLS');
            expect(req.request.params.get('comment')).toBe('Sharing reason');
            req.flush({ trainId: 'train-uuid', branches: [], mainTimestamp: '' });
        });
    });

    describe('createBranch', () => {
        it('POST /v1/trains/{trainId}/branches with branchName and comment params', () => {
            service.createBranch('train-1', 'my-branch', 'reason', minimalTrain).subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/v1/trains/train-1/branches') && r.method === 'POST',
            );
            expect(req.request.params.get('branchName')).toBe('my-branch');
            expect(req.request.params.get('comment')).toBe('reason');
            expect(req.request.headers.get('Token')).toBeTruthy();
            req.flush({});
        });
    });

    describe('getTrainById', () => {
        it('GET /v1/trains/{trainId} with Token header', () => {
            service.getTrainById('train-42').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.endsWith('/v1/trains/train-42') && r.method === 'GET',
            );
            expect(req.request.headers.get('Token')).toBeTruthy();
            req.flush({ trainId: 'train-42', branches: [], mainTimestamp: '' });
        });
    });

    describe('getTrainByVersion', () => {
        it('GET /v1/trains/versions/{version} with Token header', () => {
            service.getTrainByVersion('version-99').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/v1/trains/versions/version-99') && r.method === 'GET',
            );
            expect(req.request.headers.get('Token')).toBeTruthy();
            req.flush({});
        });
    });

    describe('getByTrainIdAndBranchId', () => {
        it('GET /v1/trains/{trainId}/branches/{branchId}', () => {
            service.getByTrainIdAndBranchId('t-1', 'b-1').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/v1/trains/t-1/branches/b-1') && r.method === 'GET',
            );
            expect(req.request.headers.get('Token')).toBeTruthy();
            req.flush({});
        });
    });

    describe('requestMerge', () => {
        it('POST /v1/trains/{trainId}/branches/{branchId}/requestMerge', () => {
            service.requestMerge('t-1', 'b-1', 'merge please').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/requestMerge') && r.method === 'POST',
            );
            expect(req.request.params.get('comment')).toBe('merge please');
            req.flush({});
        });
    });

    describe('merge', () => {
        it('POST /v1/trains/{trainId}/branches/{branchId}/merge with reviewedVersion', () => {
            service.merge('t-1', 'b-1', 'v-007', 'approved').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/merge') && r.method === 'POST',
            );
            expect(req.request.params.get('reviewedVersion')).toBe('v-007');
            expect(req.request.params.get('comment')).toBe('approved');
            req.flush({});
        });
    });

    describe('rejectMerge', () => {
        it('POST /v1/trains/{trainId}/branches/{branchId}/rejectMerge', () => {
            service.rejectMerge('t-1', 'b-1', 'not ready').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/rejectMerge') && r.method === 'POST',
            );
            expect(req.request.params.get('comment')).toBe('not ready');
            req.flush({});
        });
    });

    describe('deleteBranch', () => {
        it('DELETE /v1/trains/{trainId}/branches/{branchId}', () => {
            service.deleteBranch('t-1', 'b-1', 'cleanup').subscribe();
            const req = httpController.expectOne((r) =>
                r.url.includes('/v1/trains/t-1/branches/b-1') && r.method === 'DELETE',
            );
            expect(req.request.params.get('comment')).toBe('cleanup');
            req.flush({});
        });
    });

    describe('updateTrain', () => {

        const trainId = 'train-1';
        const branchId = 'branch-1';
        const train: Train = { ...minimalTrain };

        it('throws for an invalid operationalDay before making an HTTP request', () => {
            expect(() =>
                service.updateTrain(trainId, train, branchId, 'IC 1234', 'comment', '2026-13-01'),
            ).toThrow('Invalid ISO date "2026-13-01"');
            httpController.expectNone({});
        });

        it('throws for a date-time string instead of a date-only string', () => {
            expect(() =>
                service.updateTrain(
                    trainId,
                    train,
                    branchId,
                    'IC 1234',
                    'comment',
                    '2026-05-26T00:00:00Z',
                ),
            ).toThrow('Invalid ISO date "2026-05-26T00:00:00Z"');
            httpController.expectNone({});
        });

        it('makes an HTTP request for a valid operationalDay', () => {
            service
                .updateTrain(trainId, train, branchId, 'IC 1234', 'comment', '2026-05-26')
                .subscribe();

            const req = httpController.expectOne((r) =>
                r.url.endsWith(`/v1/trains/${trainId}/branches/${branchId}`),
            );
            expect(req.request.method).toBe('PUT');
            expect(req.request.body.startdate).toBe('2026-05-26');
            req.flush({});
        });
    });
});
