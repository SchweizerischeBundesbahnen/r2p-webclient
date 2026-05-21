import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink],
    template: `
        <div class="container" style="text-align: center; padding: 4rem 1rem;">
            <h1 style="font-size: 6rem; margin: 0;" i18n="@@notFound.code">404</h1>
            <h2 i18n="@@notFound.title">Page not found</h2>
            <p class="text-muted" i18n="@@notFound.message">The page you are looking for does not exist.</p>
            <a [routerLink]="'/'" class="btn btn-primary" i18n="@@notFound.backToOverview">Back to Overview</a>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
