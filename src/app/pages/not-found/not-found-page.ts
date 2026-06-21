import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink],
    styles: [
        `
            .nf {
                text-align: center;
                max-width: 480px;
                margin: 0 auto;
                padding: 5rem 1rem;
            }
            .nf-rule {
                width: 48px;
                height: 3px;
                background: var(--orange);
                margin: 0 auto 1.5rem;
                border-radius: 999px;
            }
            .nf-code {
                font-size: 4.5rem;
                font-weight: 800;
                line-height: 1;
                color: var(--navy);
                margin: 0;
                letter-spacing: -0.02em;
            }
            .nf-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--navy);
                margin: 0.5rem 0 0;
            }
            .nf-msg {
                color: var(--text-muted);
                margin: 0.5rem 0 1.75rem;
            }
            .nf-btn {
                display: inline-block;
                background: var(--orange);
                color: #fff;
                text-decoration: none;
                font-weight: 600;
                padding: 10px 20px;
                border-radius: 8px;
                transition: background-color 0.15s;
            }
            .nf-btn:hover {
                background: var(--orange-hover);
            }
        `,
    ],
    template: `
        <div class="nf">
            <div class="nf-rule"></div>
            <h1 class="nf-code" i18n="@@notFound.code">404</h1>
            <h2 class="nf-title" i18n="@@notFound.title">Page not found</h2>
            <p class="nf-msg" i18n="@@notFound.message">The page you are looking for does not exist.</p>
            <a [routerLink]="'/'" class="nf-btn" i18n="@@notFound.backToOverview">Back to Overview</a>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
