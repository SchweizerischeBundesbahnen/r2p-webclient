import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { BackendApiService } from '../../backend-api.service';
import { CreatePageState } from './create-train-page.state';
import { finalize } from 'rxjs';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { ErrorNotificationService } from '../../shared/error/error-notification.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatAnchor } from '@angular/material/button';

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
                        mat-stroked-button
                        [routerLink]="'/traffic-overview'"
                        id="sticky-cancel-btn"
                        i18n="@@createTrain.cancel"
                        >Cancel</a
                    >
                    <button
                        mat-raised-button
                        color="primary"
                        id="sticky-save-btn"
                        [disabled]="createTrainForm().invalid() || state.createTrainRunning()"
                        (click)="createTrain()"
                    >
                        @if (state.createTrainRunning()) {
                            <app-spinner variant="inline" />
                        }
                        <ng-container i18n="@@createTrain.save">💾 Save Train</ng-container>
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
                            <mat-form-field appearance="outline">
                                <mat-label i18n="@@createTrain.field.name">Name</mat-label>
                                <input
                                    matInput
                                    id="train-name"
                                    placeholder="e.g., IC 1234 Zürich–Basel"
                                    i18n-placeholder="@@createTrain.field.namePlaceholder"
                                    [formField]="createTrainForm.name"
                                />
                                @if (
                                    createTrainForm.name().touched() &&
                                    createTrainForm.name().invalid()
                                ) {
                                    @for (error of createTrainForm.name().errors(); track error) {
                                        <mat-error>{{ error.message }}</mat-error>
                                    }
                                }
                            </mat-form-field>
                            <mat-form-field appearance="outline" (click)="opDayInput.showPicker()">
                                <mat-label i18n="@@createTrain.field.opDay">Operational Day</mat-label>
                                <input
                                    #opDayInput
                                    matInput
                                    type="date"
                                    id="train-opday"
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
                                        <mat-error>{{ error.message }}</mat-error>
                                    }
                                }
                            </mat-form-field>
                        </div>
                        <mat-form-field appearance="outline" style="width:100%">
                            <mat-label i18n="@@createTrain.field.comment">Creation Comment</mat-label>
                            <textarea
                                matInput
                                id="save-comment"
                                rows="3"
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
                                    <mat-error>{{ error.message }}</mat-error>
                                }
                            }
                        </mat-form-field>
                    </div>
                </div>

                <!-- ── Journey Card ─────────────────────────────────────── -->
                <app-journey-route-card [readonly]="false" />
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, FormField, JourneyRouteCard, Spinner, MatFormField, MatLabel, MatError, MatHint, MatInput, MatButton, MatAnchor],
    providers: [CreatePageState],
})
export class CreateTrainPage {
    private apiService = inject(BackendApiService);
    private router = inject(Router);
    protected state = inject(CreatePageState);
    private notifications = inject(ErrorNotificationService);
    protected createTrainForm = inject(CreatePageState).createTrainForm;

    protected createTrain() {
        if (this.state.createTrainRunning()) return;
        this.state.createTrainRunning.set(true);
        const { name, creationComment, operationalDay } = this.state.createTrainForm().value();
        this.apiService
            .createTrain(name, operationalDay, creationComment)
            .pipe(
                finalize(() => {
                    this.state.createTrainRunning.set(false);
                }),
            )
            .subscribe({
                next: () => {
                    this.notifications.showSuccess($localize`:@@createTrain.saveSuccess:Train saved successfully.`);
                    this.router.navigate(['/traffic-overview']);
                },
                error: () => {
                    // Error already handled by errorInterceptor (toast shown)
                },
            });
    }
}
