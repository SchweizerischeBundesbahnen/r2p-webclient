import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { BackendApiService } from '../../backend-api.service';
import { CreatePageState } from './create-train-page.state';
import { finalize } from 'rxjs';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';

@Component({
    selector: 'app-create-train-page',
    template: `
        <div class="sticky-edit-bar" [class.dirty]="createTrainForm().dirty()" id="sticky-edit-bar">
            <div class="sticky-edit-bar-inner">
                <div class="sticky-edit-bar-title">
                    <span id="sticky-title" i18n="@@createTrain.title">Create New Train</span>
                    <span
                        class="unsaved-indicator"
                        [class.hidden]="!createTrainForm().dirty()"
                        id="unsaved-indicator"
                        i18n="@@createTrain.unsavedChanges"
                        >● Unsaved changes</span
                    >
                </div>
                <div class="sticky-edit-bar-actions">
                    <a
                        [routerLink]="'/traffic-overview'"
                        class="btn btn-ghost"
                        id="sticky-cancel-btn"
                        i18n="@@createTrain.cancel"
                        >Cancel</a
                    >
                    <button
                        class="btn btn-success"
                        id="sticky-save-btn"
                        [class.btn-muted]="createTrainForm().invalid()"
                        [disabled]="createTrainForm().invalid()"
                        (click)="createTrain()"
                        i18n="@@createTrain.save"
                    >
                        💾 Save Train
                    </button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link" i18n="@@createTrain.breadcrumb.overview">Traffic Overview</a>

                <div class="page-header">
                    <div>
                        <h1 class="page-title" i18n="@@createTrain.title">Create New Train</h1>
                        <p class="page-subtitle" i18n="@@createTrain.subtitle">Define the train details and journey route</p>
                    </div>
                </div>

                <!-- ── Basic Info Card ──────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title" i18n="@@createTrain.section.trainDetails">📋 Train Details</span>
                    </div>
                    <div class="card-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required" for="train-name" i18n="@@createTrain.field.name">Name</label>
                                <input
                                    type="text"
                                    id="train-name"
                                    class="form-input"
                                    placeholder="e.g., IC 1234 Zürich–Basel"
                                    i18n-placeholder="@@createTrain.field.namePlaceholder"
                                    [formField]="createTrainForm.name"
                                />
                                @if (
                                    createTrainForm.name().touched() &&
                                    createTrainForm.name().invalid()
                                ) {
                                    @for (error of createTrainForm.name().errors(); track error) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="train-opday" i18n="@@createTrain.field.opDay"
                                    >Operational Day</label
                                >
                                <input
                                    type="date"
                                    id="train-opday"
                                    class="form-input"
                                    [formField]="createTrainForm.operationalDay"
                                />
                                @if (
                                    createTrainForm.operationalDay().touched() &&
                                    createTrainForm.operationalDay().invalid()
                                ) {
                                    @for (
                                        error of createTrainForm.operationalDay().errors();
                                        track error
                                    ) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label required" for="save-comment" i18n="@@createTrain.field.comment"
                                >Creation Comment</label
                            >
                            <textarea
                                id="save-comment"
                                class="form-textarea"
                                placeholder="Describe this train (required for saving)…"
                                i18n-placeholder="@@createTrain.field.commentPlaceholder"
                                [formField]="createTrainForm.creationComment"
                            ></textarea>
                            @if (
                                createTrainForm.creationComment().touched() &&
                                createTrainForm.creationComment().invalid()
                            ) {
                                @for (
                                    error of createTrainForm.creationComment().errors();
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
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, FormField, JourneyRouteCard],
    providers: [CreatePageState],
})
export class CreateTrainPage {
    private apiService = inject(BackendApiService);
    private router = inject(Router);
    private state = inject(CreatePageState);
    protected createTrainForm = inject(CreatePageState).createTrainForm;

    protected createTrain() {
        if (this.state.createTrainRunning) return;
        this.state.createTrainRunning = true;
        const { name, creationComment, operationalDay } = this.state.createTrainForm().value();
        this.apiService
            .createTrain(name, operationalDay, creationComment)
            .pipe(
                finalize(() => {
                    this.state.createTrainRunning = false;
                }),
            )
            .subscribe({
                next: () => {
                    this.router.navigate(['/traffic-overview']);
                },
                error: () => {
                    // Error already handled by errorInterceptor (toast shown)
                },
            });
    }
}
