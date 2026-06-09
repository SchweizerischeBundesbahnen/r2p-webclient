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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyEditBar {
    readonly title = input.required<string>();
    readonly isDirty = input(false);
}
