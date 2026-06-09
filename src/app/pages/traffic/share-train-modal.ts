import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../core/api/backend-api.service';
import { ORGANIZATION_OPTIONS } from '../../core/settings/settings.service';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';

export interface ShareTrainDialogData {
    trainId: string;
    partners: string[];
}

@Component({
    selector: 'app-share-train-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
        MatFormField, MatLabel, MatError, MatHint,
        MatInput, MatButton, MatSelect, MatOption,
        FormField, PartnerBadge,
    ],
    templateUrl: './share-train-modal.html',
})
export class ShareTrainModalComponent {
    protected readonly data = inject<ShareTrainDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<ShareTrainModalComponent>);
    private readonly apiService = inject(BackendApiService);

    protected readonly availableOrganizations = ORGANIZATION_OPTIONS.filter(
        (org) => !this.data.partners.includes(org.name),
    );

    private readonly model = signal({ shareWith: '', comment: '' });

    protected readonly shareForm = form(this.model, (p) => {
        required(p.shareWith, { message: $localize`:@@shareTrainModal.validation.partnerRequired:Partner is required` });
        maxLength(p.shareWith, 255, { message: $localize`:@@shareTrainModal.validation.partnerMaxLength:Max 255 characters` });
        required(p.comment, { message: $localize`:@@shareTrainModal.validation.commentRequired:Comment is required` });
    });

    protected onSubmit(): void {
        void submit(this.shareForm, async (field) => {
            const { shareWith, comment } = field().value();
            await firstValueFrom(this.apiService.shareTrain(this.data.trainId, shareWith, comment));
            this.dialogRef.close('success');
        }).catch(() => {
            // Error is handled by the error interceptor (global toast)
        });
    }
}
