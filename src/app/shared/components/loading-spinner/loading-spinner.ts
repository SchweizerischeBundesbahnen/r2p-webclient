import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loading-spinner',
    imports: [MatProgressSpinnerModule],
    template: `
        <div class="loading-spinner-container">
            <mat-spinner [diameter]="48" />
            <p class="loading-spinner-label">{{ label() }}</p>
        </div>
    `,
    styles: `
        .loading-spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 2rem;
            gap: 1rem;
            color: var(--text-muted);
        }

        .loading-spinner-label {
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin: 0;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinner {
    readonly label = input<string>('Loading…');
}

