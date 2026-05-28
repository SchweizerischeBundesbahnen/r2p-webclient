import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditTrainPageState } from './edit-train-page.state';
import { FormField } from '@angular/forms/signals';
import { Branch } from '../../shared/models/api.models';
import { BackendApiService } from '../../backend-api.service';
import { finalize } from 'rxjs';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { ErrorNotificationService } from '../../shared/error/error-notification.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-edit-train-page',
    imports: [RouterLink, FormField, JourneyRouteCard, LoadingSpinner, MatProgressSpinnerModule],
    template: `
        @if (state.branch.isLoading()) {
            <div class="main-content">
                <div class="container">
                    <app-loading-spinner i18n-label="@@editTrain.loading" label="Loading train data..." />
                </div>
            </div>
        } @else if (state.branch.error()) {
            <div class="alert alert-error" i18n="@@editTrain.loadError">
                ⚠️ Failed to load train data. Please go back and try again.
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
                            i18n="@@editTrain.unsavedChanges"
                            >● Unsaved changes</span
                        >
                    </div>
                    <div class="sticky-edit-bar-actions">
                        <a
                            [routerLink]="'/traffic-view/' + trainId()"
                            class="btn btn-ghost"
                            id="sticky-cancel-btn"
                            i18n="@@editTrain.cancel"
                            >Cancel</a
                        >
                        <button
                            class="btn btn-success"
                            id="sticky-save-btn"
                            [class.btn-muted]="editTrainForm().invalid() || state.editTrainRunning()"
                            [disabled]="editTrainForm().invalid() || state.editTrainRunning()"
                            (click)="updateTrain()"
                        >
                            @if (state.editTrainRunning()) {
                                <mat-spinner [diameter]="16" />
                            }
                            <ng-container i18n="@@editTrain.save">💾 Save Train</ng-container>
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
                        i18n="@@editTrain.breadcrumb.traffic"
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
                        <ng-container i18n="@@editTrain.editingInfo">✏️ You are editing variant</ng-container>
                        <strong id="branch-name-display"> {{ branchInfos.branchName }}</strong
                        >. <ng-container i18n="@@editTrain.editingInfoSub">Changes will be saved as a new version of this variant.</ng-container>
                    </div>

                    <!-- ── Basic Info Card ──────────────────────────────────── -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title" i18n="@@editTrain.section.trainDetails">📋 Train Details</span>
                        </div>
                        <div class="card-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label required" for="train-name" i18n="@@editTrain.field.name">Name</label>
                                    <input
                                        type="text"
                                        id="train-name"
                                        class="form-input"
                                        [formField]="editTrainForm.name"
                                    />
                                    @if (
                                        editTrainForm.name().touched() &&
                                        editTrainForm.name().invalid()
                                    ) {
                                        @for (error of editTrainForm.name().errors(); track error) {
                                            <span class="form-error">{{ error.message }}</span>
                                        }
                                    }
                                </div>
                                <div class="form-group">
                                    <label class="form-label required" for="train-opday" i18n="@@editTrain.field.opDay"
                                        >Operational Day</label
                                    >
                                    <input
                                        type="date"
                                        id="train-opday"
                                        class="form-input"
                                        [formField]="editTrainForm.operationalDay"
                                    />
                                    @if (
                                        editTrainForm.operationalDay().touched() &&
                                        editTrainForm.operationalDay().invalid()
                                    ) {
                                        @for (
                                            error of editTrainForm.operationalDay().errors();
                                            track error
                                        ) {
                                            <span class="form-error">{{ error.message }}</span>
                                        }
                                    }
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="save-comment" i18n="@@editTrain.field.comment"
                                    >Change Comment</label
                                >
                                <textarea
                                    id="save-comment"
                                    class="form-textarea"
                                    placeholder="Describe what you changed…"
                                    i18n-placeholder="@@editTrain.field.commentPlaceholder"
                                    [formField]="editTrainForm.creationComment"
                                ></textarea>
                                @if (
                                    editTrainForm.creationComment().touched() &&
                                    editTrainForm.creationComment().invalid()
                                ) {
                                    @for (
                                        error of editTrainForm.creationComment().errors();
                                        track error
                                    ) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
                            </div>
                        </div>
                    </div>

                    <!-- ── Journey Card ─────────────────────────────────────── -->
                    <app-journey-route-card [readonly]="false" />

                    <!-- ── Action Buttons (removed – use sticky bar above) ──────── -->
                </div>
            </div>
        }
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTrainPage {
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();
    private apiService = inject(BackendApiService);
    private router = inject(Router);
    private notifications = inject(ErrorNotificationService);
    protected state = inject(EditTrainPageState);
    protected editTrainForm = this.state.editTrainForm;

    private readonly updateState = effect(() => {
        this.state.trainId.set(this.trainId());
        this.state.branchId.set(this.branchId());
    });

    protected updateTrain() {
        if (this.editTrainForm().invalid()) return;
        const { train, branch } = this.state.branch.value()!;
        const { name, operationalDay, creationComment } = this.editTrainForm().value();
        this.state.editTrainRunning.set(true);
        this.apiService
            .updateTrain(
                this.trainId(),
                train,
                branch.branchId,
                name,
                creationComment,
                operationalDay,
            )
            .pipe(
                finalize(() => {
                    this.state.editTrainRunning.set(false);
                }),
            )
            .subscribe({
                next: () => {
                    this.notifications.showSuccess($localize`:@@editTrain.saveSuccess:Train saved successfully.`);
                    this.router.navigate(['/traffic-view/' + this.trainId()]);
                },
                error: () => {
                    // Error already handled by errorInterceptor (toast shown)
                }
            });
    }

    protected getBranchInfos(value: Branch | undefined): {
        trainNumber: string;
        branchName: string;
    } {
        const {
            branchName,
            business: { trainNumber },
        } = value!;
        return { branchName, trainNumber };
    }
}
