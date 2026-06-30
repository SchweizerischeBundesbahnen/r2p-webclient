import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
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
import { Breadcrumb, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';

@Component({
    selector: 'app-edit-train-page',
    imports: [RouterLink, JourneyRouteCard, Spinner, MatButton, MatAnchor, StickyEditBar, AlertBanner, TrainDetailsFormCard, Breadcrumb],
    providers: [EditTrainPageState],
    templateUrl: './edit-train-page.html',
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

    protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
        { label: $localize`:@@common.breadcrumb.trafficOverview:Traffic overview`, link: '/traffic-overview' },
        { label: $localize`:@@common.breadcrumb.trafficView:Traffic view`, link: '/traffic-view/' + this.trainId() },
        { label: $localize`:@@editTrain.breadcrumb:Edit` },
    ]);

    private readonly updateState = effect(() => {
        this.state.trainId.set(this.trainId());
        this.state.branchId.set(this.branchId());
    });

    protected updateTrain() {
        if (this.editTrainForm().invalid()) return;
        const { train, branch } = this.state.branch.value()!;
        const { trainNumber, operationalDay, creationComment } = this.editTrainForm().value();
        this.state.editTrainRunning.set(true);
        this.apiService
            .updateTrain(
                this.trainId(),
                train,
                branch.branchId,
                trainNumber,
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
                    this.notifications.showSuccess($localize`:@@common.train.saveSuccess:Train saved successfully.`);
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
