import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-sticky-edit-bar',
    imports: [],
    template: `
        <div class="sticky-edit-bar" [class.dirty]="isDirty()" id="sticky-edit-bar">
            <div class="sticky-edit-bar-inner">
                <div class="sticky-edit-bar-title">
                    <span id="sticky-title">{{ title() }}</span>
                    <span
                        class="unsaved-indicator"
                        [class.hidden]="!isDirty()"
                        id="unsaved-indicator"
                        i18n="@@stickyEditBar.unsavedChanges"
                        >● Unsaved changes</span
                    >
                </div>
                <div class="sticky-edit-bar-actions">
                    <ng-content />
                </div>
            </div>
        </div>
    `,
    styles: `
        .sticky-edit-bar {
            position: sticky;
            top: 64px;
            z-index: 99;
            background: var(--card-background);
            border-bottom: 2px solid var(--border-color);
            transition: border-color 0.3s;
        }
        .sticky-edit-bar.dirty {
            border-bottom-color: var(--tl-yellow);
        }
        .sticky-edit-bar-inner {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0.55rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        .sticky-edit-bar-title {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--text-primary);
            min-width: 0;
        }
        .sticky-edit-bar-title span:first-child {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .unsaved-indicator {
            font-size: 0.78rem;
            font-weight: 700;
            color: var(--tl-yellow);
            white-space: nowrap;
            animation: unsavedPulse 2s ease-in-out infinite;
        }
        .unsaved-indicator.hidden { display: none; }
        @keyframes unsavedPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
        }
        .sticky-edit-bar-actions {
            display: flex;
            gap: var(--spacing-sm);
            align-items: center;
            flex-shrink: 0;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyEditBar {
    readonly title = input.required<string>();
    readonly isDirty = input(false);
}
