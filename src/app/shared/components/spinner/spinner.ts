import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner',
    imports: [MatProgressSpinner],
    template: `
        @if (variant() === 'page') {
            <div class="spinner-page">
                <mat-spinner [diameter]="48" />
            </div>
        } @else {
            <mat-spinner [diameter]="16" />
        }
    `,
    styles: `
        .spinner-page {
            display: flex;
            justify-content: center;
            padding: 3rem 2rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
    readonly variant = input<'page' | 'inline'>('page');
}
