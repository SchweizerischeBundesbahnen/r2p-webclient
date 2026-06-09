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
    templateUrl: './new-variant-modal.html',
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
