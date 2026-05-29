import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { BackendApiService } from '../../backend-api.service';
import { ORGANIZATION_OPTIONS } from '../../settings/settings.service';

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
        FormField,
    ],
    template: `
        <h2 mat-dialog-title i18n="@@shareTrainModal.title">Share Train</h2>

        <mat-dialog-content>
            <form>
                @if (data.partners.length > 0) {
                    <p i18n="@@shareTrainModal.sharedWith">Already shared with</p>
                    <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
                        @for (partner of data.partners; track partner) {
                            <span class="partner-badge partner-badge-{{ partner }}">{{ partner }}</span>
                        }
                    </div>
                }

                <mat-form-field appearance="outline" style="width:100%; margin-top:0.5rem;">
                    <mat-label i18n="@@shareTrainModal.field.partner">Partner</mat-label>
                    <mat-select [formField]="shareForm.shareWith">
                        @for (org of availableOrganizations; track org.name) {
                            <mat-option [value]="org.name">
                                <span class="partner-badge partner-badge-{{ org.name }}"
                                      style="margin-right:0.5rem;">{{ org.name }}</span>
                                {{ org.label }}
                            </mat-option>
                        }
                    </mat-select>
                    <mat-hint i18n="@@shareTrainModal.field.partnerHint">
                        Name of the partner to share the train with.
                    </mat-hint>
                    @if (shareForm.shareWith().touched() && shareForm.shareWith().invalid()) {
                        @for (error of shareForm.shareWith().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" style="width:100%; margin-top:1rem;">
                    <mat-label i18n="@@shareTrainModal.field.comment">Comment</mat-label>
                    <textarea
                        matInput
                        [formField]="shareForm.comment"
                        rows="3"
                        placeholder="Reason for sharing…"
                        i18n-placeholder="@@shareTrainModal.field.commentPlaceholder"
                    ></textarea>
                    @if (shareForm.comment().touched() && shareForm.comment().invalid()) {
                        @for (error of shareForm.comment().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close i18n="@@shareTrainModal.cancel">Cancel</button>
            <button
                mat-flat-button
                type="button"
                [disabled]="shareForm().submitting()"
                (click)="onSubmit()"
            >
                @if (shareForm().submitting()) {
                    <ng-container i18n="@@shareTrainModal.submitting">Sharing…</ng-container>
                } @else {
                    <ng-container i18n="@@shareTrainModal.submit">Share</ng-container>
                }
            </button>
        </mat-dialog-actions>
    `,
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
