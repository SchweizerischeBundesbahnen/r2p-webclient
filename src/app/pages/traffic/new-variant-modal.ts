import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TrafficPageState } from './traffic-page.state';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { BackendApiService } from '../../backend-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-new-variant-modal',
    template: ` <div class="modal-overlay" id="modal-create-branch">
        <div class="modal-card">
            <div class="modal-header">
                <span class="modal-title">⎇ Create New Variant</span>
                <button class="modal-close" (click)="state.toggleIsNewVariantModalOpen()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label required" for="branch-name-input">Variant Name</label>
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
                    @if (
                        createTrainVariant.variantName().touched() &&
                        createTrainVariant.variantName().invalid()
                    ) {
                        @for (error of createTrainVariant.variantName().errors(); track error) {
                            <span class="form-error">{{ error.message }}</span>
                        }
                    }
                </div>
                <div class="form-group">
                    <label class="form-label required" for="branch-comment-input">Comment</label>
                    <textarea
                        id="branch-comment-input"
                        class="form-textarea"
                        placeholder="Describe the purpose of this variant…"
                        [formField]="createTrainVariant.comment"
                    ></textarea>
                    @if (
                        createTrainVariant.comment().touched() &&
                        createTrainVariant.comment().invalid()
                    ) {
                        @for (error of createTrainVariant.comment().errors(); track error) {
                            <span class="form-error">{{ error.message }}</span>
                        }
                    }
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-ghost" (click)="state.toggleIsNewVariantModalOpen()">
                    Cancel
                </button>
                <button
                    [class.btn-muted]="createTrainVariant().invalid()"
                    [disabled]="createTrainVariant().invalid()"
                    class="btn btn-primary"
                    (click)="createNewVariant()"
                >
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
    private router = inject(Router);
    private apiService = inject(BackendApiService);
    protected state = inject(TrafficPageState);

    private model = signal<{
        variantName: string;
        comment: string;
    }>({
        variantName: '',
        comment: '',
    });

    createTrainVariant = form(this.model, (schemaPath) => {
        required(schemaPath.variantName, { message: 'Variant Name is required' });
        maxLength(schemaPath.variantName, 255, { message: 'Max 255 characters.' });
        required(schemaPath.comment, { message: 'Comment is required' });
    });

    protected createNewVariant() {
        if (this.state.createNewVariantRunning) return;
        this.state.createNewVariantRunning = true;
        const trainId = this.state.trainId();
        const { variantName, comment } = this.createTrainVariant().value();
        if (trainId) {
            this.apiService
                .createBranch(trainId, variantName, comment)
                .pipe(
                    finalize(() => {
                        this.state.createNewVariantRunning = false;
                    }),
                )
                .subscribe({
                    next: (result) => {
                        this.router.navigate(['/edit-train'], {
                            queryParams: { trainId, branchId: result.branchId },
                        });
                    },
                    error: (err) => {
                        console.warn('Error creating new variant:', err);
                    },
                });
        }
    }
}
