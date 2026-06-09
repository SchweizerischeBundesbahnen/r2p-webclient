import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error-interceptor';
import { ErrorNotificationService } from './error-notification.service';
import { vi } from 'vitest';

describe('errorInterceptor', () => {
    let http: HttpClient;
    let httpController: HttpTestingController;
    let showSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        showSpy = vi.fn();
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([errorInterceptor])),
                provideHttpClientTesting(),
                { provide: ErrorNotificationService, useValue: { showError: showSpy } },
            ],
        });
        http = TestBed.inject(HttpClient);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpController.verify());

    function triggerRequest(status: number, body: string | object | null = null): void {
        http.get('/test').subscribe({ error: (e: unknown) => void e });
        httpController.expectOne('/test').flush(body, { status, statusText: 'Error' });
    }

    describe('generic status-code messages', () => {
        it('shows a network error message for status 0', () => {
            triggerRequest(0);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('Network error'));
        });

        it('shows an unauthorized message for status 401', () => {
            triggerRequest(401);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('Unauthorised'));
        });

        it('shows an access denied message for status 403 without body', () => {
            triggerRequest(403);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('Access denied'));
        });

        it('shows a not found message for status 404', () => {
            triggerRequest(404);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
        });

        it('shows a server error message for status 500', () => {
            triggerRequest(500);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('Server error'));
        });

        it('shows an unexpected error message for status 422', () => {
            triggerRequest(422);
            expect(showSpy).toHaveBeenCalledWith(expect.stringContaining('Unexpected error'));
        });
    });

    describe('API detail extraction', () => {
        it('appends the detail field from an API error body (object)', () => {
            triggerRequest(403, {
                detail: 'Partner is not instance owner',
                title: 'Forbidden',
                status: 403,
                instance: '/v1/trains',
            });
            const message: string = showSpy.mock.calls[0][0];
            expect(message).toContain('Access denied');
            expect(message).toContain('Partner is not instance owner');
        });

        it('appends the detail field when body is a JSON string', () => {
            triggerRequest(400, JSON.stringify({ detail: 'Train already exists', status: 400 }));
            const message: string = showSpy.mock.calls[0][0];
            expect(message).toContain('Train already exists');
        });

        it('uses title as fallback when detail is absent', () => {
            triggerRequest(403, { title: 'Forbidden – custom reason', status: 403 });
            const message: string = showSpy.mock.calls[0][0];
            expect(message).toContain('Forbidden – custom reason');
        });

        it('shows only the generic message when body has no detail or title', () => {
            triggerRequest(403, { code: 'ERR_001' });
            const message: string = showSpy.mock.calls[0][0];
            expect(message).not.toContain(' — ');
        });

        it('shows only the generic message when body is null', () => {
            triggerRequest(500, null);
            const message: string = showSpy.mock.calls[0][0];
            expect(message).not.toContain(' — ');
        });

        it('shows only the generic message when detail is an empty string', () => {
            triggerRequest(403, { detail: '', status: 403 });
            const message: string = showSpy.mock.calls[0][0];
            expect(message).not.toContain(' — ');
        });

        it('separates the generic and detail message with " — "', () => {
            triggerRequest(422, { detail: 'Validation failed', status: 422 });
            const message: string = showSpy.mock.calls[0][0];
            expect(message).toContain(' — Validation failed');
        });
    });
});



