import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../core/api/backend-api.service';

export interface DeleteTrainDialogData {
    trainId: string;
    branchId: string;
    trainNumber: string;
}

@Component({
    selector: 'app-delete-train-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormField,
        MatLabel,
        MatError,
        MatInput,
        MatButton,
        FormField,
    ],
    styles: [`
        .dialog-warning { margin-bottom: 1rem; color: var(--mat-sys-error); font-size: 0.9rem; font-weight: 500; }
        .full-width { width: 100%; }
    `],
    template: `
        <h2 mat-dialog-title i18n="@@deleteTrainModal.title">Delete Train</h2>

        <mat-dialog-content>
            <p class="dialog-warning">
                <ng-container i18n="@@deleteTrainModal.warning">
                    ⚠ Deleting train <strong>{{ data.trainNumber }}</strong> will permanently remove
                    the main branch and all its variants. This action cannot be undone.
                </ng-container>
            </p>
            <form>
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label i18n="@@deleteTrainModal.field.comment">Reason for deletion</mat-label>
                    <textarea
                        matInput
                        [formField]="deleteForm.comment"
                        rows="3"
                        placeholder="Describe why this train is being deleted…"
                        i18n-placeholder="@@deleteTrainModal.field.commentPlaceholder"
                    ></textarea>
                    @if (deleteForm.comment().touched() && deleteForm.comment().invalid()) {
                        @for (error of deleteForm.comment().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close i18n="@@common.cancel">Cancel</button>
            <button
                mat-flat-button
                color="warn"
                type="button"
                [disabled]="deleteForm().submitting()"
                (click)="onSubmit()"
            >
                @if (deleteForm().submitting()) {
                    <ng-container i18n="@@deleteTrainModal.submitting">Deleting…</ng-container>
                } @else {
                    <ng-container i18n="@@deleteTrainModal.submit">Delete Train</ng-container>
                }
            </button>
        </mat-dialog-actions>
    `,
})
export class DeleteTrainModal {
    protected readonly data = inject<DeleteTrainDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<DeleteTrainModal>);
    private readonly apiService = inject(BackendApiService);

    private readonly model = signal({ comment: '' });

    protected readonly deleteForm = form(this.model, (p) => {
        required(p.comment, {
            message: $localize`:@@deleteTrainModal.validation.commentRequired:Reason for deletion is required`,
        });
    });

    protected onSubmit(): void {
        void submit(this.deleteForm, async (field) => {
            const { comment } = field().value();
            await firstValueFrom(
                this.apiService.deleteBranch(this.data.trainId, this.data.branchId, comment),
            );
            this.dialogRef.close('success');
        }).catch(() => {
            // Error handled by the global error interceptor
        });
    }
}
