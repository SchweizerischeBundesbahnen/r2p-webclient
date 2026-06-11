import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { Branch, BranchState } from '../../shared/models/api.models';
import { DatePipe } from '@angular/common';
import { NewVariantModal, NewVariantDialogData } from './new-variant-modal';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { BranchStatusBadgeComponent } from './branch-status-badge';
import {
    isoDateToUtc,
    parseDurationToDate,
} from '../../shared/utils/date.utils';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { DetailGrid, DetailItem } from '../../shared/components/detail-grid/detail-grid';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';
import { AlertBanner } from '../../shared/components/alert-banner/alert-banner';
import { ShareTrainModalComponent, ShareTrainDialogData } from './share-train-modal';
import { RequestMergeModalComponent, RequestMergeDialogData } from './request-merge-modal';
import { AcceptMergeModalComponent, AcceptMergeDialogData } from './accept-merge-modal';
import { RejectMergeModalComponent, RejectMergeDialogData } from './reject-merge-modal';
import { DeleteTrainModal, DeleteTrainDialogData } from './delete-train-modal';
import { SettingsService, ORGANIZATION_OPTIONS } from '../../core/settings/settings.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import {
    getEarliestJourneyLocationDeparture,
    getFirstJourneyLocationName,
    getLastJourneyLocationName,
    getLatestJourneyLocationArrival,
} from '../../shared/utils/journeyLocation.utils';
import { OverallStatusComponent } from '../../shared/components/overall-status/overall-status.component';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink, DatePipe, JourneyRouteCard, BranchStatusBadgeComponent, Spinner, MatButton, MatAnchor, MatTooltip, DetailGrid, DetailItem, PartnerBadge, AlertBanner, OverallStatusComponent],
    templateUrl: './traffic-page.html',
    styleUrl: './traffic-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficPage {
    readonly trainId = input.required<string>();
    protected readonly trafficPageStateService = inject(TrafficPageState);
    protected readonly isoDateToUtc = isoDateToUtc;
    private readonly dialog = inject(MatDialog);
    private readonly settingsService = inject(SettingsService);
    private readonly router = inject(Router);

    private readonly currentOrg = computed(() => this.settingsService.settings().organization);

    protected readonly canShareTrain = computed(() => {
        const partners = this.trainMainBranch.value()?.listElement?.partners ?? [];
        const org = this.currentOrg();
        return ORGANIZATION_OPTIONS.some((o) => o.name !== org && !partners.includes(o.name));
    });

    protected readonly isLeadRu = computed(() => {
        const branches = this.trainMainBranch.value()?.listElement?.branches ?? [];
        const mainBranch = branches.find((b) => b.technical.mainBranch);
        return mainBranch?.technical.owner === this.currentOrg();
    });

    private readonly trainIdEffect = effect(() => {
        const id = this.trainId();
        const prevId = untracked(() => this.trafficPageStateService.trainId());
        this.trafficPageStateService.trainId.set(id);
        if (id && id === prevId) {
            this.trainMainBranch.reload();
        }
    });

    protected readonly trainMainBranch = this.trafficPageStateService.trainMainBranch;

    protected openShareModal(): void {
        const trainId = this.trafficPageStateService.trainId();
        if (!trainId) return;
        const partners = this.trainMainBranch.value()?.listElement?.partners ?? [];
        this.dialog
            .open<ShareTrainModalComponent, ShareTrainDialogData>(ShareTrainModalComponent, {
                data: { trainId, partners },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
                }
            });
    }

    protected openNewVariantModal(): void {
        const trainId = this.trafficPageStateService.trainId();
        const details = this.trainMainBranch.value()?.details;
        if (!trainId || !details || this.trainMainBranch.isLoading()) return;
        this.dialog
            .open<NewVariantModal, NewVariantDialogData>(NewVariantModal, {
                data: { trainId, mainBranchTrain: details },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
                }
            });
    }

    protected openDeleteTrainModal(): void {
        const trainId = this.trafficPageStateService.trainId();
        const branches = this.trainMainBranch.value()?.listElement?.branches ?? [];
        const mainBranch = branches.find((b) => b.technical.mainBranch);
        const trainNumber = mainBranch?.business.trainNumber ?? '';
        if (!trainId || !mainBranch) return;
        this.dialog
            .open<DeleteTrainModal, DeleteTrainDialogData>(DeleteTrainModal, {
                data: { trainId, branchId: mainBranch.branchId, trainNumber },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    void this.router.navigate(['/traffic-overview']);
                }
            });
    }

    protected openRequestMergeModal(branch: VariantViewModel): void {
        const trainId = this.trafficPageStateService.trainId();
        if (!trainId) return;
        this.dialog
            .open<RequestMergeModalComponent, RequestMergeDialogData>(RequestMergeModalComponent, {
                data: { trainId, branchId: branch.branchId, branchName: branch.branchName },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
                }
            });
    }

    protected openAcceptMergeModal(branch: VariantViewModel): void {
        const trainId = this.trafficPageStateService.trainId();
        if (!trainId) return;
        this.dialog
            .open<AcceptMergeModalComponent, AcceptMergeDialogData>(AcceptMergeModalComponent, {
                data: {
                    trainId,
                    branchId: branch.branchId,
                    branchName: branch.branchName,
                    reviewedVersion: branch.version,
                },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
                }
            });
    }

    protected openRejectMergeModal(branch: VariantViewModel): void {
        const trainId = this.trafficPageStateService.trainId();
        if (!trainId) return;
        this.dialog
            .open<RejectMergeModalComponent, RejectMergeDialogData>(RejectMergeModalComponent, {
                data: { trainId, branchId: branch.branchId, branchName: branch.branchName },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
                }
            });
    }

    protected getTrainHeaderInfo(
        trainWithDetails: TrainWithDetails | undefined,
    ): TrainHeaderViewModel {
        const listElement = trainWithDetails?.listElement;
        const mainBranch = listElement?.branches.find((b) => b.technical.mainBranch);
        const operationalDay = mainBranch?.business.operationalDay;

        return {
            trainNumber: mainBranch?.business.trainNumber ?? '-',
            operationalDay: operationalDay ?? null,
            partners: listElement?.partners ?? [],
            lastChange: mainBranch?.technical.timestamp ?? null,
            branches: listElement?.branches ?? [],
            from: getFirstJourneyLocationName(trainWithDetails?.details) ?? '-',
            to: getLastJourneyLocationName(trainWithDetails?.details) ?? '-',
            departureTime: parseDurationToDate(
                operationalDay,
                getEarliestJourneyLocationDeparture(trainWithDetails?.details),
            ),
            arrivalTime: parseDurationToDate(
                operationalDay,
                getLatestJourneyLocationArrival(trainWithDetails?.details),
            ),
        };
    }

    protected getVariantInfo(trainWithDetails: TrainWithDetails | undefined): VariantViewModel[] {
        const branches = trainWithDetails?.listElement?.branches ?? [];
        const currentOrg = this.currentOrg();
        const isLeadRU = this.isLeadRu();

        const sorted = [...branches].sort((a, b) => {
            if (a.technical.mainBranch && !b.technical.mainBranch) return -1;
            if (!a.technical.mainBranch && b.technical.mainBranch) return 1;
            return b.technical.timestamp.localeCompare(a.technical.timestamp);
        });

        return sorted.map((branch) => {
            const isOwn = branch.technical.owner === currentOrg;
            const state = branch.technical.branchState;
            const isMain = branch.technical.mainBranch;
            return {
                branchId: branch.branchId,
                branchName: branch.branchName,
                comment: branch.technical.comment,
                partners: branch.technical.owner ? [branch.technical.owner] : [],
                lastChange: branch.technical.timestamp,
                status: state,
                version: branch.technical.version,
                showEdit: isOwn,
                showMergeRequest: isOwn && state === 'open' && !isMain,
                showAcceptReject: isLeadRU && state === 'merge_requested' && !isMain,
            };
        });
    }
}

export interface TrainHeaderViewModel {
    trainNumber: string;
    operationalDay: string | null;
    partners: string[];
    lastChange: string | null;
    branches: Branch[];
    from: string;
    to: string;
    departureTime: string | undefined;
    arrivalTime: string | undefined;
}

export interface VariantViewModel {
    branchId: string;
    comment: string;
    branchName: string;
    partners: string[];
    lastChange: string;
    status: BranchState;
    version: string;
    showMergeRequest: boolean;
    showAcceptReject: boolean;
    showEdit: boolean;
}
