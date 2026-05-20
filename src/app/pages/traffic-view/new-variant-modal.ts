import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TrafficPageStateService } from './traffic-page-state.service';
import { form, FormField, maxLength, required } from '@angular/forms/signals';

@Component({
    selector: 'app-new-variant-modal',
    template: `
        <div class="modal-overlay" id="modal-create-branch">
            <div class="modal-card">
                <div class="modal-header">
                    <span class="modal-title">⎇ Create New Variant</span>
                    <button
                        class="modal-close"
                        (click)="trafficPageStateService.toggleNewVariantModal()"
                    >
                        ✕
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label required" for="branch-name-input">Variant
                            Name</label>
                        <input
                            type="text"
                            id="branch-name-input"
                            class="form-input"
                            placeholder="e.g., sbb/rolling-stock-update"
                            [formField]="createTrainVariant.variantName"
                        />
                        <p class="form-hint">
                            Lowercase, hyphens and slashes allowed. Max 255 characters.
                        </p>
                        @if (createTrainVariant.variantName().touched() &&
                        createTrainVariant.variantName().invalid()) {
                            @for (error of createTrainVariant.variantName().errors(); track error) {
                                <span class="form-error">{{ error.message }}</span>
                            }
                        }
                    </div>
                    <div class="form-group">
                        <label class="form-label required"
                               for="branch-comment-input">Comment</label>
                        <textarea
                            id="branch-comment-input"
                            class="form-textarea"
                            placeholder="Describe the purpose of this variant…"
                            [formField]="createTrainVariant.comment"
                        ></textarea>
                        @if (createTrainVariant.comment().touched() &&
                        createTrainVariant.comment().invalid()) {
                            @for (error of createTrainVariant.comment().errors(); track error) {
                                <span class="form-error">{{ error.message }}</span>
                            }
                        }
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        class="btn btn-ghost"
                        (click)="trafficPageStateService.toggleNewVariantModal()"
                    >
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="confirmCreateBranch()">
                        ⎇ Create &amp; Edit
                    </button>
                </div>
            </div>
        </div>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormField],
})
export class NewVariantModal {
    trafficPageStateService = inject(TrafficPageStateService);

    createTrainVariant = form(model, (schemaPath) => {
        required(schemaPath.variantName, { message: 'Variant Name is required' });
        maxLength(schemaPath.variantName, 255, { message: 'Max 255 characters.' });
        required(schemaPath.comment, { message: 'Comment is required' });
    });
}

export const model = signal<{
    variantName: string;
    comment: string;
}>({
    variantName: '',
    comment: '',
});
