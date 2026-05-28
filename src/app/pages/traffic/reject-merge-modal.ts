import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../backend-api.service';

export interface RejectMergeDialogData {
    trainId: string;
    branchId: string;
    branchName: string;
}

@Component({
    selector: 'app-reject-merge-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField],
    template: `
        <h2 mat-dialog-title i18n="@@rejectMergeModal.title">Reject Variant</h2>

        <mat-dialog-content>
            <p style="margin-bottom:1rem; color:var(--mat-sys-on-surface-variant); font-size:0.9rem;">
                <ng-container i18n="@@rejectMergeModal.info">
                    Rejecting variant <strong>{{ data.branchName }}</strong>.
                    The variant will revert to <em>Open</em> state and the partner can continue
                    working on it.
                </ng-container>
            </p>
            <form>
                <mat-form-field appearance="outline" style="width:100%;">
                    <mat-label i18n="@@rejectMergeModal.field.comment">Comment</mat-label>
                    <textarea
                        matInput
                        [formField]="rejectForm.comment"
                        rows="3"
                        placeholder="Reason for rejecting this variant…"
                        i18n-placeholder="@@rejectMergeModal.field.commentPlaceholder"
                    ></textarea>
                    @if (rejectForm.comment().touched() && rejectForm.comment().invalid()) {
                        @for (error of rejectForm.comment().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close i18n="@@rejectMergeModal.cancel">Cancel</button>
            <button
                mat-flat-button
                type="button"
                [disabled]="rejectForm().submitting()"
                (click)="onSubmit()"
            >
                @if (rejectForm().submitting()) {
                    <ng-container i18n="@@rejectMergeModal.submitting">Rejecting…</ng-container>
                } @else {
                    <ng-container i18n="@@rejectMergeModal.submit">Reject Variant</ng-container>
                }
            </button>
        </mat-dialog-actions>
    `,
})
export class RejectMergeModalComponent {
    protected readonly data = inject<RejectMergeDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<RejectMergeModalComponent>);
    private readonly apiService = inject(BackendApiService);

    private readonly model = signal({ comment: '' });

    protected readonly rejectForm = form(this.model, (p) => {
        required(p.comment, {
            message: $localize`:@@rejectMergeModal.validation.commentRequired:Comment is required`,
        });
    });

    protected onSubmit(): void {
        void submit(this.rejectForm, async (field) => {
            const { comment } = field().value();
            await firstValueFrom(
                this.apiService.rejectMerge(this.data.trainId, this.data.branchId, comment),
            );
            this.dialogRef.close('success');
        }).catch(() => {
            // Error is handled by the error interceptor (global toast)
        });
    }
}




