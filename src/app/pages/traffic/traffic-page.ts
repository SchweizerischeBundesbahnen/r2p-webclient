import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { DetailGrid, DetailItem } from '../../shared/components/detail-grid/detail-grid';
import { PartnerBadge } from '../../shared/components/partner-badge/partner-badge';
import { AlertBanner } from '../../shared/components/alert-banner/alert-banner';
import { ShareTrainModalComponent, ShareTrainDialogData } from './share-train-modal';
import { RequestMergeModalComponent, RequestMergeDialogData } from './request-merge-modal';
import { AcceptMergeModalComponent, AcceptMergeDialogData } from './accept-merge-modal';
import { RejectMergeModalComponent, RejectMergeDialogData } from './reject-merge-modal';
import { SettingsService } from '../../settings/settings.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import {
    getEarliestJourneyLocationDeparture,
    getFirstJourneyLocationName,
    getLastJourneyLocationName,
    getLatestJourneyLocationArrival,
} from '../../shared/utils/journeyLocation.utils';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink, DatePipe, JourneyRouteCard, BranchStatusBadgeComponent, Spinner, MatButton, MatAnchor, DetailGrid, DetailItem, PartnerBadge, AlertBanner],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link" i18n="@@traffic.breadcrumb.overview">Traffic Overview</a>

                @if (trainMainBranch.value(); as trainData) {
                @let trainHeaderInfo = getTrainHeaderInfo(trainData);
                @let variants = getVariantInfo(trainData);
                <div class="card" id="train-header-card">
                    <div class="card-body">
                        <div
                            style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;"
                        >
                            <div>
                                <h1 class="page-title" id="train-title">
                                    {{ trainHeaderInfo.trainNumber }}
                                </h1>
                                <p class="page-subtitle" id="train-name">
                                    @let opDay = trainHeaderInfo.operationalDay;
                                    {{ opDay ? (isoDateToUtc(opDay) | date: 'mediumDate' : 'UTC') : '-' }}
                                </p>
                            </div>
                            <div class="btn-group">
                                <button mat-stroked-button color="primary" (click)="openShareModal()" i18n="@@traffic.shareTrain">
                                    🔗 Share Train
                                </button>
                                <button
                                    mat-raised-button
                                    color="primary"
                                    (click)="openNewVariantModal()"
                                    i18n="@@traffic.newVariant"
                                >
                                    ⎇ New Variant
                                </button>
                            </div>
                        </div>

                        <app-detail-grid style="margin-top:1rem;">
                            <app-detail-item label="Train Number" i18n-label="@@traffic.field.trainNumber" valueId="detail-train-number">{{ trainHeaderInfo.trainNumber }}</app-detail-item>
                            <app-detail-item label="From" i18n-label="@@traffic.field.from" valueId="detail-from">{{ trainHeaderInfo.from }}</app-detail-item>
                            <app-detail-item label="Departure" i18n-label="@@traffic.field.departure" valueId="detail-dep-time">{{ trainHeaderInfo.departureTime | date: 'shortTime' }}</app-detail-item>
                            <app-detail-item label="To" i18n-label="@@traffic.field.to" valueId="detail-to">{{ trainHeaderInfo.to }}</app-detail-item>
                            <app-detail-item label="Arrival" i18n-label="@@traffic.field.arrival" valueId="detail-arr-time">{{ trainHeaderInfo.arrivalTime | date: 'shortTime' }}</app-detail-item>
                            <app-detail-item label="Operational Day" i18n-label="@@traffic.field.opDay" valueId="detail-op-day">
                                @let opDayDetail = trainHeaderInfo.operationalDay;
                                {{ opDayDetail ? (isoDateToUtc(opDayDetail) | date: 'mediumDate' : 'UTC') : '-' }}
                            </app-detail-item>
                            <!-- Overall Status: kept as raw HTML due to inline tooltip -->
                            <div class="detail-item">
                                <div class="detail-label">
                                    <ng-container i18n="@@traffic.field.overallStatus">Overall Status</ng-container>
                                    <span class="tooltip-anchor" tabindex="0"
                                    >?<span class="tooltip-box"
                                    ><ng-container i18n="@@traffic.status.allConfirmed">🟢 All activities are <em>confirmed</em>.</ng-container><br /><ng-container i18n="@@traffic.status.someProposed">🟡 At least one activity is <em>proposed</em> or <em>requested</em>, none refused.</ng-container><br /><ng-container i18n="@@traffic.status.someRefused">🔴 At least one activity is <em>refused</em> or <em>dropped</em>.</ng-container></span
                                    ></span
                                    >
                                </div>
                                <div class="detail-value" id="detail-status">
                                    <span class="traffic-light tl-green"><span class="tl-dot"></span></span>
                                </div>
                            </div>
                            <app-detail-item label="Partners" i18n-label="@@traffic.field.partners" valueId="detail-partners">
                                @for (partner of trainHeaderInfo.partners; track partner) {
                                    <app-partner-badge [partner]="partner" />
                                }
                            </app-detail-item>
                        </app-detail-grid>
                    </div>
                </div>

                <!-- Journey (main variant – read-only table) -->
                <app-journey-route-card [readonly]="true" [journey]="trainMainBranch.value()?.details?.journey" />

                <!-- Variants Section -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title" i18n="@@traffic.variants">⎇ Variants</span>
                    </div>
                    <div id="branches-list">
                        @for (branch of variants; track branch.branchName) {
                            <div class="branch-row">
                                <div class="branch-info">
                                    <div>
                                        <div class="branch-name">🌿 {{ branch.branchName }}</div>
                                        <div class="branch-meta">
                                            @for (partner of branch.partners; track partner) {
                                                <app-partner-badge [partner]="partner" />
                                            }
                                            <span style="margin-left:4px;">{{
                                                    branch.lastChange | date: 'short'
                                                }}</span>
                                            @if (branch.comment) {
                                                — <em>{{ branch.comment }}</em>
                                            }
                                        </div>
                                    </div>
                                </div>
                                 <div
                                     style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;"
                                 >
                                     <app-branch-status-badge [state]="branch.status" />
                                      <div class="branch-actions">
                                          @if (branch.showEdit) {
                                              <a
                                                  routerLink="/edit-train"
                                                  [queryParams]="{
                                                      trainId: trainId(),
                                                      branchId: branch.branchId,
                                                  }"
                                                  mat-raised-button
                                                  color="primary"
                                                  i18n="@@traffic.edit">✏ Edit</a>
                                          }
                                          <a
                                              [routerLink]="'/read-train'"
                                              [queryParams]="{
                                                  trainId: trainId(),
                                                  branchId: branch.branchId,
                                              }"
                                              mat-button
                                              i18n="@@traffic.view">👁 View</a
                                          >
                                         @if (branch.showMergeRequest) {
                                             <button
                                                 mat-stroked-button
                                                 (click)="openRequestMergeModal(branch)"
                                                 i18n="@@traffic.mergeRequest"
                                             >Propose Variant</button>
                                         }
                                         @if (branch.showAcceptReject) {
                                             <button
                                                 mat-raised-button
                                                 color="primary"
                                                 (click)="openAcceptMergeModal(branch)"
                                                 i18n="@@traffic.acceptMerge"
                                             >Accept Variant</button>
                                             <button
                                                 mat-raised-button
                                                 color="warn"
                                                 (click)="openRejectMergeModal(branch)"
                                                 i18n="@@traffic.rejectMerge"
                                             >Reject Variant</button>
                                         }
                                     </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                } @else if (trainMainBranch.error()) {
                    <app-alert-banner type="error" i18n="@@traffic.loadError">
                        ⚠️ Failed to load train data. Please go back and try again.
                    </app-alert-banner>
                } @else if (trainMainBranch.isLoading()) {
                    <app-spinner />
                }
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficPage {
    readonly trainId = input.required<string>();
    protected readonly trafficPageStateService = inject(TrafficPageState);
    protected readonly isoDateToUtc = isoDateToUtc;
    private readonly dialog = inject(MatDialog);
    private readonly settingsService = inject(SettingsService);

    private readonly currentOrg = computed(() => this.settingsService.settings().organization);

    private readonly trainIdEffect = effect(() => {
        this.trafficPageStateService.trainId.set(this.trainId());
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
        if (!trainId) return;
        this.dialog
            .open<NewVariantModal, NewVariantDialogData>(NewVariantModal, {
                data: { trainId },
                width: '480px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.trainMainBranch.reload();
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
        const mainBranch = branches.find((b) => b.technical.mainBranch);
        const isLeadRU = mainBranch?.technical.owner === currentOrg;

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
