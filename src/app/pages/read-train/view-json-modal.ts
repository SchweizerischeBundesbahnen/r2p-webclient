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
            <button mat-button mat-dialog-close i18n="@@viewJsonModal.close">Close</button>
        </mat-dialog-actions>
    `,
})
export class ViewJsonModal {
    protected readonly data = inject<ViewJsonDialogData>(MAT_DIALOG_DATA);
}
