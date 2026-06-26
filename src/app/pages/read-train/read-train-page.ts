import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReadTrainPageState } from './read-train-page.state';
import { ViewJsonModal, ViewJsonDialogData } from './view-json-modal';
import { DatePipe } from '@angular/common';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { Spinner } from '../../shared/components/spinner/spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatAnchor } from '@angular/material/button';
import { DetailGrid, DetailItem } from '../../shared/components/detail-grid/detail-grid';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';
import { AlertBanner } from '../../shared/components/alert-banner/alert-banner';
import { Breadcrumb, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';

@Component({
    selector: 'app-read-train-page',
    imports: [RouterLink, DatePipe, JourneyRouteCard, Spinner, MatButton, MatAnchor, DetailGrid, DetailItem, PartnerBadge, AlertBanner, Breadcrumb],
    providers: [ReadTrainPageState],
    templateUrl: './read-train-page.html',
    styleUrl: './read-train-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadTrainPage {
    protected state = inject(ReadTrainPageState);
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();
    protected readonly isoDateToUtc = isoDateToUtc;
    private readonly dialog = inject(MatDialog);

    protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
        { label: $localize`:@@common.breadcrumb.trafficOverview:Traffic overview`, link: '/traffic-overview' },
        { label: $localize`:@@common.breadcrumb.trafficView:Traffic view`, link: '/traffic-view/' + this.trainId() },
        { label: $localize`:@@readTrain.breadcrumb.read:Read view` },
    ]);

    private readonly updateState = effect(() => {
        this.state.trainId.set(this.trainId());
        this.state.branchId.set(this.branchId());
    });

    protected openJsonModal(): void {
        const train = this.state.trainAndBranch.value()?.train;
        if (!train) return;
        this.dialog.open<ViewJsonModal, ViewJsonDialogData>(ViewJsonModal, {
            data: { train },
            width: '860px',
        });
    }
}
