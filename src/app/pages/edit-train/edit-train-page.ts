import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditPageState } from './edit-train-state';
import { FormField } from '@angular/forms/signals';
import { Branch } from '../../shared/models/api.models';
import { BackendApiService } from '../../backend-api.service';

@Component({
    selector: 'app-edit-train-page',
    imports: [RouterLink, FormField],
    template: `
        @if (state.branch.isLoading()) {
            <div class="loading-overlay">
                <div class="spinner"></div>
                <span>Loading train data...</span>
            </div>
        } @else {
            <div
                class="sticky-edit-bar"
                [class.dirty]="editTrainForm().dirty()"
                id="sticky-edit-bar"
            >
                @let branchInfos = getBranchInfos(state.branch.value()?.branch);
                <div class="sticky-edit-bar-inner">
                    <div class="sticky-edit-bar-title">
                        <span id="sticky-title">Edit: {{ branchInfos.trainNumber }}</span>
                        <span
                            class="unsaved-indicator"
                            [class.hidden]="!editTrainForm().dirty()"
                            id="unsaved-indicator"
                        >● Unsaved changes</span
                        >
                    </div>
                    <div class="sticky-edit-bar-actions">
                        <a
                            [routerLink]="'/traffic-view/' + trainId()"
                            class="btn btn-ghost"
                            id="sticky-cancel-btn"
                        >Cancel</a
                        >
                        <button
                            class="btn btn-success"
                            id="sticky-save-btn"
                            [class.btn-muted]="editTrainForm().invalid()"
                            [disabled]="editTrainForm().invalid()"
                            (click)="updateTrain()"
                        >
                            💾 Save Train
                        </button>
                    </div>
                </div>
            </div>

            <!-- ── Main Content ────────────────────────────────────────────── -->
            <div class="main-content">
                <div class="container">
                    <a
                        [routerLink]="'/traffic-view/' + this.trainId()"
                        class="back-link"
                        id="back-link"
                    >Traffic View</a
                    >

                    <!-- Page Header with variant info -->
                    <div class="page-header">
                        <div>
                            <h1 class="page-title" id="page-title">
                                Edit: {{ branchInfos.trainNumber }}
                            </h1>
                            <p class="page-subtitle" id="page-subtitle">
                                Variant: {{ branchInfos.branchName }}
                            </p>
                        </div>
                    </div>

                    <!-- Variant context info -->
                    <div class="alert alert-info" id="branch-alert">
                        ✏️ You are editing variant
                        <strong id="branch-name-display"> {{ branchInfos.branchName }}</strong
                        >. Changes will be saved as a new version of this variant.
                    </div>

                    <!-- ── Basic Info Card ──────────────────────────────────── -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">📋 Train Details</span>
                        </div>
                        <div class="card-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label required" for="train-name">Name</label>
                                    <input
                                        type="text"
                                        id="train-name"
                                        class="form-input"
                                        [formField]="editTrainForm.name"
                                    />
                                    @if (editTrainForm.name().touched() &&
                                    editTrainForm.name().invalid()) {
                                        @for (error of editTrainForm.name().errors(); track error) {
                                            <span class="form-error">{{ error.message }}</span>
                                        }
                                    }
                                </div>
                                <div class="form-group">
                                    <label class="form-label required" for="train-opday"
                                    >Operational Day</label
                                    >
                                    <input
                                        type="date"
                                        id="train-opday"
                                        class="form-input"
                                        [formField]="editTrainForm.operationalDay"
                                    />
                                    @if (editTrainForm.operationalDay().touched() &&
                                    editTrainForm.operationalDay().invalid()) {
                                        @for (error of editTrainForm.operationalDay().errors();
                                            track error) {
                                            <span class="form-error">{{ error.message }}</span>
                                        }
                                    }
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="save-comment"
                                >Change Comment</label
                                >
                                <textarea
                                    id="save-comment"
                                    class="form-textarea"
                                    placeholder="Describe what you changed…"
                                    [formField]="editTrainForm.creationComment"
                                ></textarea>
                                @if (editTrainForm.creationComment().touched() &&
                                editTrainForm.creationComment().invalid()) {
                                    @for (error of editTrainForm.creationComment().errors();
                                        track error) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
                            </div>
                        </div>
                    </div>

                    <!-- ── Journey Card ─────────────────────────────────────── -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">🗺️ Journey Route</span>
                        </div>
                        <div class="card-body" style="padding:0;">
                            <div class="journey-table-wrapper">
                                <table class="journey-table" id="journey-table">
                                    <thead>
                                    <tr>
                                        <th style="width:200px;">Stop</th>
                                        <th>Rolling Stock</th>
                                        <th>Staff</th>
                                        <th>Path</th>
                                    </tr>
                                    </thead>
                                    <tbody id="journey-tbody">
                                    <!-- Rendered by JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ── Action Buttons (removed – use sticky bar above) ──────── -->
                </div>
            </div>
        }
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [EditPageState],
})
export class EditTrainPage {
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();
    private apiService = inject(BackendApiService);
    private router = inject(Router);
    protected state = inject(EditPageState);
    protected editTrainForm = this.state.editTrainForm;

    private readonly trainIdEffect = effect(() => {
        this.state.trainId.set(this.trainId());
        this.state.branchId.set(this.branchId());
    });

    protected updateTrain() {
        if (this.editTrainForm().invalid()) return;
        const { train, branch } = this.state.branch.value()!;
        const { name, operationalDay, creationComment } = this.editTrainForm().value();
        this.apiService
            .updateTrain(
                this.trainId(),
                train,
                branch.branchId,
                name,
                creationComment,
                operationalDay,
            )
            .subscribe({
                next: () => (this.state.editTrainSuccess = true),
                error: (err) => {
                    this.state.editTrainSuccess = false;
                    console.warn('Error creating train:', err);
                },
                complete: () => {
                    console.log(
                        'Create train request done. Success: ',
                        this.state.editTrainSuccess,
                    );
                    this.state.editTrainRunning = false;
                    if (this.state.editTrainSuccess) {
                        this.router.navigate(['/traffic-view/' + this.trainId()]);
                    }
                },
            });
    }

    protected getBranchInfos(value: Branch | undefined): {
        trainNumber: string;
        branchName: string;
    } {
        console.log('Getting branch infos for branch:', value);
        const {
            branchName,
            business: { trainNumber },
        } = value!;
        return { branchName, trainNumber };
    }
}
