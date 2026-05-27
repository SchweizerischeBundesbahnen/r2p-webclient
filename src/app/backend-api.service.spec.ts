import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BackendApiService, minimalTrain } from './backend-api.service';
import { Train } from './shared/models/api.models';

describe('BackendApiService', () => {
    let service: BackendApiService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting(), BackendApiService],
        });
        service = TestBed.inject(BackendApiService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpController.verify());

    describe('createTrain', () => {
        it('throws for an invalid operationalDay before making an HTTP request', () => {
            expect(() => service.createTrain('IC 1234', '2026-02-30', 'comment')).toThrow(
                'Invalid ISO date "2026-02-30"',
            );
            httpController.expectNone({});
        });

        it('throws for a date-time string instead of a date-only string', () => {
            expect(() =>
                service.createTrain('IC 1234', '2026-05-26T10:00:00', 'comment'),
            ).toThrow('Invalid ISO date "2026-05-26T10:00:00"');
            httpController.expectNone({});
        });

        it('makes an HTTP request for a valid operationalDay', () => {
            service.createTrain('IC 1234', '2026-05-26', 'comment').subscribe();

            const req = httpController.expectOne((r) => r.url.endsWith('/v1/trains'));
            expect(req.request.method).toBe('POST');
            expect(req.request.body.startdate).toBe('2026-05-26');
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

