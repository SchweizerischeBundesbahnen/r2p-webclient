import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../core/api/backend-api.service';

export interface AcceptMergeDialogData {
    trainId: string;
    branchId: string;
    branchName: string;
    reviewedVersion: string;
}

@Component({
    selector: 'app-accept-merge-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormField, MatLabel, MatError, MatInput, MatButton, FormField],
    template: `
        <h2 mat-dialog-title i18n="@@acceptMergeModal.title">Accept Variant</h2>

        <mat-dialog-content>
            <p style="margin-bottom:1rem; color:var(--mat-sys-on-surface-variant); font-size:0.9rem;">
                <ng-container i18n="@@acceptMergeModal.warning">
                    Variant <strong>{{ data.branchName }}</strong> will be taken over into <strong>main</strong>.
                    This action cannot be undone.
                </ng-container>
            </p>
            <form>
                <mat-form-field appearance="outline" style="width:100%;">
                    <mat-label i18n="@@common.field.comment">Comment</mat-label>
                    <textarea
                        matInput
                        [formField]="acceptForm.comment"
                        rows="3"
                        placeholder="Reason for accepting this variant…"
                        i18n-placeholder="@@acceptMergeModal.field.commentPlaceholder"
                    ></textarea>
                    @if (acceptForm.comment().touched() && acceptForm.comment().invalid()) {
                        @for (error of acceptForm.comment().errors(); track error.kind) {
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
                type="button"
                [disabled]="acceptForm().submitting()"
                (click)="onSubmit()"
            >
                @if (acceptForm().submitting()) {
                    <ng-container i18n="@@acceptMergeModal.submitting">Accepting…</ng-container>
                } @else {
                    <ng-container i18n="@@acceptMergeModal.submit">Accept Variant</ng-container>
                }
            </button>
        </mat-dialog-actions>
    `,
})
export class AcceptMergeModalComponent {
    protected readonly data = inject<AcceptMergeDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<AcceptMergeModalComponent>);
    private readonly apiService = inject(BackendApiService);

    private readonly model = signal({ comment: '' });

    protected readonly acceptForm = form(this.model, (p) => {
        required(p.comment, {
            message: $localize`:@@common.validation.commentRequired:Comment is required`,
        });
    });

    protected onSubmit(): void {
        void submit(this.acceptForm, async (field) => {
            const { comment } = field().value();
            await firstValueFrom(
                this.apiService.merge(
                    this.data.trainId,
                    this.data.branchId,
                    this.data.reviewedVersion,
                    comment,
                ),
            );
            this.dialogRef.close('success');
        }).catch(() => {
            // Error is handled by the error interceptor (global toast)
        });
    }
}




