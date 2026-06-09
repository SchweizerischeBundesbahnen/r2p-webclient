import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditTrainPageState } from './edit-train-page.state';
import { Branch, Journey } from '../../shared/models/api.models';
import { BackendApiService } from '../../core/api/backend-api.service';
import { finalize } from 'rxjs';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { ErrorNotificationService } from '../../core/error/error-notification.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import { MatButton, MatAnchor } from '@angular/material/button';
import { StickyEditBar } from '../../shared/components/sticky-edit-bar/sticky-edit-bar';
import { AlertBanner } from '../../shared/components/alert-banner/alert-banner';
import { TrainDetailsFormCard } from '../../shared/components/train-details-form-card/train-details-form-card';

@Component({
    selector: 'app-edit-train-page',
    imports: [RouterLink, JourneyRouteCard, Spinner, MatButton, MatAnchor, StickyEditBar, AlertBanner, TrainDetailsFormCard],
    template: `
        @if (state.branch.isLoading()) {
            <div class="main-content">
                <div class="container">
                    <app-spinner />
                </div>
            </div>
        } @else if (state.branch.error()) {
            <app-alert-banner type="error" i18n="@@editTrain.loadError">
                ⚠️ Failed to load train data. Please go back and try again.
            </app-alert-banner>
        } @else {
            @let branchInfos = getBranchInfos(state.branch.value()?.branch);
            <app-sticky-edit-bar
                [title]="'Edit: ' + branchInfos.trainNumber"
                [isDirty]="editTrainForm().dirty()"
            >
                <a
                    mat-stroked-button
                    [routerLink]="'/traffic-view/' + trainId()"
                    id="sticky-cancel-btn"
                    i18n="@@editTrain.cancel"
                    >Cancel</a
                >
                <button
                    mat-raised-button
                    color="primary"
                    id="sticky-save-btn"
                    [disabled]="editTrainForm().invalid() || state.editTrainRunning()"
                    (click)="updateTrain()"
                >
                    @if (state.editTrainRunning()) {
                        <app-spinner variant="inline" />
                    }
                    <ng-container i18n="@@editTrain.save">💾 Save Train</ng-container>
                </button>
            </app-sticky-edit-bar>

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
                    <app-alert-banner type="info" id="branch-alert">
                        <ng-container i18n="@@editTrain.editingInfo">✏️ You are editing variant</ng-container>
                        <strong id="branch-name-display"> {{ branchInfos.branchName }}</strong
                        >. <ng-container i18n="@@editTrain.editingInfoSub">Changes will be saved as a new version of this variant.</ng-container>
                    </app-alert-banner>

                    <!-- ── Basic Info Card ──────────────────────────────────── -->
                    <app-train-details-form-card
                        [trainForm]="editTrainForm"
                        commentLabel="Change Comment"
                        i18n-commentLabel="@@editTrain.field.comment"
                        commentPlaceholder="Describe what you changed…"
                        i18n-commentPlaceholder="@@editTrain.field.commentPlaceholder"
                    />

                    <!-- ── Journey Card ─────────────────────────────────────── -->
                    <app-journey-route-card
                        [readonly]="false"
                        [journey]="state.branch.value()?.train?.journey"
                        (journeyChange)="onJourneyChange($event)"
                    />
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

    protected onJourneyChange(journey: Journey): void {
        const current = this.state.branch.value();
        if (!current) return;
        this.state.branch.set({ ...current, train: { ...current.train, journey } });
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
