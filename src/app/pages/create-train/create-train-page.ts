import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
    templateUrl: './create-train-page.html',
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
    protected readonly isJourneyEmpty = computed(() => !this.state.journey().journeylocations?.length);

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
