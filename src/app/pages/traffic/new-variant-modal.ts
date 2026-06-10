import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { BackendApiService } from '../../core/api/backend-api.service';
import { SettingsService } from '../../core/settings/settings.service';
import { Train } from '../../shared/models/api.models';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface NewVariantDialogData {
    trainId: string;
    mainBranchTrain: Train;
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
        MatPrefix,
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
    private readonly settingsService = inject(SettingsService);
    protected readonly orgPrefix = computed(() => {
        const org = this.settingsService.settings().organization;
        return org ? `${org}-` : '';
    });

    private readonly model = signal({ variantName: '', comment: '' });

    createTrainVariant = form(this.model, (schemaPath) => {
        required(schemaPath.variantName, {
            message: $localize`:@@validation.required:Required`,
        });
        maxLength(schemaPath.variantName, 255, {
            message: $localize`:@@newVariantModal.validation.nameMaxLength:Max 255 characters`,
        });
        required(schemaPath.comment, {
            message: $localize`:@@validation.required:Required`,
        });
    });

    protected createNewVariant(): void {
        void submit(this.createTrainVariant, async (field) => {
            const { variantName, comment } = field().value();
            const result = await firstValueFrom(
                this.apiService.createBranch(
                    this.data.trainId,
                    variantName,
                    comment,
                    this.data.mainBranchTrain,
                ),
            );
            this.dialogRef.close('success');
            void this.router.navigate(['/edit-train'], {
                queryParams: { trainId: this.data.trainId, branchId: result.branchId },
            });
        }).catch(() => {
            // Error is handled by the error interceptor (global toast)
        });
    }
}
