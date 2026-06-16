import { inject, Injectable, signal } from '@angular/core';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs';

/** sessionStorage key holding the number of consecutive re-auth redirects without success. */
const REDIRECT_COUNT_KEY = 'r2p-auth-redirect-count';
/**
 * Number of silent redirect attempts allowed before the settings dialog is
 * shown. One attempt is mandatory — we cannot tell a wrong-but-well-formed
 * client id / redirect uri apart from a normal "just needs to re-login via the
 * existing IdP session" case without actually trying once. But if that single
 * attempt comes back without a code, it is a real misconfiguration and we
 * surface the dialog immediately rather than looping a second time.
 */
const MAX_REDIRECTS = 1;

/**
 * Central place for handling an expired/invalid session.
 *
 * Goal: when the session can no longer be renewed silently, re-authenticate the
 * user via a full-page redirect WITHOUT any error message or confirmation. The
 * redirect counter guards against infinite loops caused by a genuinely broken
 * IdP configuration (wrong client id / unregistered redirect uri).
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
    private readonly oidc = inject(OidcSecurityService);
    private readonly events = inject(PublicEventsService);

    /**
     * True while a full-page re-auth redirect has been triggered. The error
     * interceptor reads this to suppress misleading toasts while the page
     * navigates away.
     */
    readonly redirectInProgress = signal(false);

    /** Wire background silent-renew failures to a clean full-page re-login. */
    initialize(): void {
        this.events
            .registerForEvents()
            .pipe(filter((notification) => notification.type === EventTypes.SilentRenewFailed))
            .subscribe(() => this.beginReauth());
    }

    /** True when we have already redirected too often without success (likely misconfig). */
    hasExceededRedirectBudget(): boolean {
        return this.readCount() >= MAX_REDIRECTS;
    }

    /** Trigger a silent full-page login redirect. */
    beginReauth(): void {
        // Re-entrancy guard: a failing silent renew can emit several events in
        // quick succession, and the route guard may also trigger re-auth at the
        // same time. Only the first call counts — otherwise the redirect counter
        // would inflate and exhaust the budget on a single logical failure.
        if (this.redirectInProgress()) {
            return;
        }
        this.redirectInProgress.set(true);
        this.writeCount(this.readCount() + 1);
        this.oidc.authorize();
    }

    /** Reset the loop guard after a confirmed-authenticated check. */
    markAuthenticated(): void {
        this.resetRedirectBudget();
        this.redirectInProgress.set(false);
    }

    /** Reset the redirect counter (e.g. before showing the settings dialog). */
    resetRedirectBudget(): void {
        this.writeCount(0);
    }

    private readCount(): number {
        const raw = sessionStorage.getItem(REDIRECT_COUNT_KEY);
        const parsed = raw ? Number.parseInt(raw, 10) : 0;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    private writeCount(count: number): void {
        sessionStorage.setItem(REDIRECT_COUNT_KEY, String(Math.max(0, count)));
    }
}
