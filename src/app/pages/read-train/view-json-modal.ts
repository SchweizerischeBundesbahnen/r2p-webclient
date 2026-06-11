import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Train } from '../../shared/models/api.models';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface ViewJsonDialogData {
    train: Train;
}

@Component({
    selector: 'app-read-view-json-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JsonPipe, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
    template: `
        <h2 mat-dialog-title i18n="@@viewJsonModal.title">JSON – Train Payload</h2>
        <mat-dialog-content>
            <pre class="json-viewer" id="json-viewer-content">{{ data.train | json }}</pre>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close i18n="@@common.close">Close</button>
        </mat-dialog-actions>
    `,
    styles: `
        .json-viewer {
            background-color: #1a202c;
            color: #e2e8f0;
            padding: var(--spacing-md);
            border-radius: 6px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.8rem;
            line-height: 1.5;
            overflow: auto;
            max-height: 60vh;
            white-space: pre;
        }
    `,
})
export class ViewJsonModal {
    protected readonly data = inject<ViewJsonDialogData>(MAT_DIALOG_DATA);
}
