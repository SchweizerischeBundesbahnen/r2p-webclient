import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../core/api/backend-api.service';

export interface RequestMergeDialogData {
    trainId: string;
    branchId: string;
    branchName: string;
}

@Component({
    selector: 'app-request-merge-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormField, MatLabel, MatError, MatInput, MatButton, FormField],
    template: `
        <h2 mat-dialog-title i18n="@@requestMergeModal.title">Propose Variant</h2>

        <mat-dialog-content>
            <p style="margin-bottom:1rem; color:var(--mat-sys-on-surface-variant); font-size:0.9rem;">
                <ng-container i18n="@@requestMergeModal.info">
                    Proposing this variant to be taken over into
                    <strong>main</strong>. The variant name is:
                </ng-container>
                <strong>{{ data.branchName }}</strong>
            </p>
            <form>
                <mat-form-field appearance="outline" style="width:100%;">
                    <mat-label i18n="@@common.field.comment">Comment</mat-label>
                    <textarea
                        matInput
                        [formField]="mergeForm.comment"
                        rows="3"
                        placeholder="Describe what you changed and why…"
                        i18n-placeholder="@@requestMergeModal.field.commentPlaceholder"
                    ></textarea>
                    @if (mergeForm.comment().touched() && mergeForm.comment().invalid()) {
                        @for (error of mergeForm.comment().errors(); track error.kind) {
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
                [disabled]="mergeForm().submitting()"
                (click)="onSubmit()"
            >
                @if (mergeForm().submitting()) {
                    <ng-container i18n="@@requestMergeModal.submitting">Submitting…</ng-container>
                } @else {
                    <ng-container i18n="@@requestMergeModal.submit">Propose Variant</ng-container>
                }
            </button>
        </mat-dialog-actions>
    `,
})
export class RequestMergeModalComponent {
    protected readonly data = inject<RequestMergeDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<RequestMergeModalComponent>);
    private readonly apiService = inject(BackendApiService);

    private readonly model = signal({ comment: '' });

    protected readonly mergeForm = form(this.model, (p) => {
        required(p.comment, {
            message: $localize`:@@common.validation.commentRequired:Comment is required`,
        });
    });

    protected onSubmit(): void {
        void submit(this.mergeForm, async (field) => {
            const { comment } = field().value();
            await firstValueFrom(
                this.apiService.requestMerge(this.data.trainId, this.data.branchId, comment),
            );
            this.dialogRef.close('success');
        }).catch(() => {
            // Error is handled by the error interceptor (global toast)
        });
    }
}



