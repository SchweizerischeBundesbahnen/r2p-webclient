import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { BackendApiService } from '../../core/api/backend-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

export interface NewVariantDialogData {
    trainId: string;
}

@Component({
    selector: 'app-new-variant-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormField,
        MatLabel,
        MatError,
        MatHint,
        MatInput,
        MatButton,
        FormField,
    ],
    template: `
        <h2 mat-dialog-title i18n="@@newVariantModal.title">⎇ Create New Variant</h2>
        <mat-dialog-content>
            <mat-form-field appearance="outline" style="width:100%; margin-top:0.5rem;">
                <mat-label i18n="@@newVariantModal.field.name">Variant Name</mat-label>
                <input
                    matInput
                    [formField]="createTrainVariant.variantName"
                    placeholder="e.g., sbb/rolling-stock-update"
                    i18n-placeholder="@@newVariantModal.field.namePlaceholder"
                />
                <mat-hint i18n="@@newVariantModal.field.nameHint"
                    >Lowercase, hyphens and slashes allowed. Max 255 characters.</mat-hint
                >
                @if (
                    createTrainVariant.variantName().touched() &&
                    createTrainVariant.variantName().invalid()
                ) {
                    @for (error of createTrainVariant.variantName().errors(); track error) {
                        <mat-error>{{ error.message }}</mat-error>
                    }
                }
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-top:1rem;">
                <mat-label i18n="@@newVariantModal.field.comment">Comment</mat-label>
                <textarea
                    matInput
                    [formField]="createTrainVariant.comment"
                    rows="3"
                    placeholder="Describe the purpose of this variant…"
                    i18n-placeholder="@@newVariantModal.field.commentPlaceholder"
                ></textarea>
                @if (
                    createTrainVariant.comment().touched() &&
                    createTrainVariant.comment().invalid()
                ) {
                    @for (error of createTrainVariant.comment().errors(); track error) {
                        <mat-error>{{ error.message }}</mat-error>
                    }
                }
            </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close i18n="@@newVariantModal.cancel">Cancel</button>
            <button
                mat-raised-button
                color="primary"
                [disabled]="createTrainVariant().invalid() || isRunning()"
                (click)="createNewVariant()"
                i18n="@@newVariantModal.createAndEdit"
            >
                ⎇ Create &amp; Edit
            </button>
        </mat-dialog-actions>
    `,
})
export class NewVariantModal {
    private readonly data = inject<NewVariantDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<NewVariantModal>);
    private readonly router = inject(Router);
    private readonly apiService = inject(BackendApiService);
    protected readonly isRunning = signal(false);

    private readonly model = signal({ variantName: '', comment: '' });

    createTrainVariant = form(this.model, (schemaPath) => {
        required(schemaPath.variantName, { message: 'Variant Name is required' });
        maxLength(schemaPath.variantName, 255, { message: 'Max 255 characters.' });
        required(schemaPath.comment, { message: 'Comment is required' });
    });

    protected createNewVariant() {
        if (this.isRunning()) return;
        this.isRunning.set(true);
        const { variantName, comment } = this.createTrainVariant().value();
        this.apiService
            .createBranch(this.data.trainId, variantName, comment)
            .pipe(finalize(() => this.isRunning.set(false)))
            .subscribe({
                next: (result) => {
                    this.dialogRef.close('success');
                    this.router.navigate(['/edit-train'], {
                        queryParams: { trainId: this.data.trainId, branchId: result.branchId },
                    });
                },
                error: () => {
                    // Error is handled by the error interceptor (global toast)
                },
            });
    }
}
