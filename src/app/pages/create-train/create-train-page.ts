import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BackendApiService } from '../../core/api/backend-api.service';
import { CreatePageState } from './create-train-page.state';
import { finalize } from 'rxjs';
import { Journey } from '../../shared/models/api.models';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { ErrorNotificationService } from '../../core/error/error-notification.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import { MatButton, MatAnchor } from '@angular/material/button';
import { StickyEditBar } from '../../shared/components/sticky-edit-bar/sticky-edit-bar';
import { TrainDetailsFormCard } from '../../shared/components/train-details-form-card/train-details-form-card';

@Component({
    selector: 'app-create-train-page',
    template: `
        <app-sticky-edit-bar
            title="Create New Train"
            i18n-title="@@createTrain.title"
            [isDirty]="createTrainForm().dirty()"
        >
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
        </app-sticky-edit-bar>
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link" i18n="@@createTrain.breadcrumb.overview">Traffic Overview</a>

                <div class="page-header">
                    <div>
                        <h1 class="page-title" i18n="@@createTrain.title">Create New Train</h1>
                        <p class="page-subtitle" i18n="@@createTrain.subtitle">Define the train details and journey route</p>
                    </div>
                </div>

                <app-train-details-form-card
                    [trainForm]="createTrainForm"
                    commentLabel="Creation Comment"
                    i18n-commentLabel="@@createTrain.field.comment"
                    namePlaceholder="e.g., IC 1234 Zürich–Basel"
                    i18n-namePlaceholder="@@createTrain.field.namePlaceholder"
                    commentPlaceholder="Describe this train (required for saving)…"
                    i18n-commentPlaceholder="@@createTrain.field.commentPlaceholder"
                />

                <app-journey-route-card
                    [readonly]="false"
                    [journey]="state.journey()"
                    (journeyChange)="onJourneyChange($event)"
                />
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, JourneyRouteCard, Spinner, MatButton, MatAnchor, StickyEditBar, TrainDetailsFormCard],
    providers: [CreatePageState],
})
export class CreateTrainPage {
    private readonly apiService = inject(BackendApiService);
    private readonly router = inject(Router);
    protected readonly state = inject(CreatePageState);
    private readonly notifications = inject(ErrorNotificationService);
    protected readonly createTrainForm = this.state.createTrainForm;

    protected onJourneyChange(journey: Journey): void {
        this.state.journey.set(journey);
    }

    protected createTrain() {
        if (this.state.createTrainRunning()) return;
        this.state.createTrainRunning.set(true);
        const { name, creationComment, operationalDay } = this.state.createTrainForm().value();
        this.apiService
            .createTrain(name, operationalDay, creationComment, this.state.journey())
            .pipe(finalize(() => this.state.createTrainRunning.set(false)))
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
