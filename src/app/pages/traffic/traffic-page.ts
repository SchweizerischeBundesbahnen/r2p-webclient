import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { Branch, BranchState } from '../../shared/models/api.models';
import { DatePipe } from '@angular/common';
import { NewVariantModal } from './new-variant-modal';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { BranchStatusBadgeComponent } from './branch-status-badge';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { MatDialog } from '@angular/material/dialog';
import { ShareTrainModalComponent, ShareTrainDialogData } from './share-train-modal';
import { RequestMergeModalComponent, RequestMergeDialogData } from './request-merge-modal';
import { AcceptMergeModalComponent, AcceptMergeDialogData } from './accept-merge-modal';
import { RejectMergeModalComponent, RejectMergeDialogData } from './reject-merge-modal';
import { SettingsService } from '../../settings/settings.service';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink, DatePipe, NewVariantModal, JourneyRouteCard, BranchStatusBadgeComponent, Spinner],
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
                                <button class="btn btn-outline" (click)="openShareModal()" i18n="@@traffic.shareTrain">
                                    🔗 Share Train
                                </button>
                                <button
                                    class="btn btn-primary"
                                    (click)="trafficPageStateService.toggleIsNewVariantModalOpen()"
                                    i18n="@@traffic.newVariant"
                                >
                                    ⎇ New Variant
                                </button>
                            </div>
                        </div>

                        <div class="detail-grid" style="margin-top:1rem;">
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.trainNumber">Train Number</div>
                                <div class="detail-value" id="detail-train-number">
                                    {{ trainHeaderInfo.trainNumber }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.from">From</div>
                                <div class="detail-value" id="detail-from">
                                    {{ trainHeaderInfo.from }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.departure">Departure</div>
                                <div class="detail-value" id="detail-dep-time">
                                    {{ trainHeaderInfo.departureTime | date: 'shortTime' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.to">To</div>
                                <div class="detail-value" id="detail-to">
                                    {{ trainHeaderInfo.to }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.arrival">Arrival</div>
                                <div class="detail-value" id="detail-arr-time">
                                    {{ trainHeaderInfo.arrivalTime | date: 'shortTime' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.opDay">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">
                                    @let opDayDetail = trainHeaderInfo.operationalDay;
                                    {{ opDayDetail ? (isoDateToUtc(opDayDetail) | date: 'mediumDate' : 'UTC') : '-' }}
                                </div>
                            </div>
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
                                    <span class="traffic-light tl-green"
                                    ><span class="tl-dot"></span
                                    ></span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.partners">Partners</div>
                                <div class="detail-value" id="detail-partners">
                                    @for (partner of trainHeaderInfo.partners; track partner) {
                                        <span class="partner-badge partner-badge-{{ partner }}">{{
                                                partner
                                            }}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Journey (main variant – read-only table) -->
                <app-journey-route-card [readonly]="true" />

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
                                                <span
                                                    class="partner-badge partner-badge-{{
                                                        partner
                                                    }}"
                                                >{{ partner }}</span
                                                >
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
                                                  class="btn btn-primary btn-sm"
                                                  i18n="@@traffic.edit">✏ Edit</a>
                                          }
                                          <a
                                              [routerLink]="'/read-train'"
                                              [queryParams]="{
                                                  trainId: trainId(),
                                                  branchId: branch.branchId,
                                              }"
                                              class="btn btn-ghost btn-sm"
                                              i18n="@@traffic.view">👁 View</a
                                          >
                                         @if (branch.showMergeRequest) {
                                             <button
                                                 class="btn btn-outline btn-sm"
                                                 (click)="openRequestMergeModal(branch)"
                                                 i18n="@@traffic.mergeRequest"
                                             >Propose Variant</button>
                                         }
                                         @if (branch.showAcceptReject) {
                                             <button
                                                 class="btn btn-success btn-sm"
                                                 (click)="openAcceptMergeModal(branch)"
                                                 i18n="@@traffic.acceptMerge"
                                             >Accept Variant</button>
                                             <button
                                                 class="btn btn-danger btn-sm"
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
                    <div class="alert alert-error" i18n="@@traffic.loadError">
                        ⚠️ Failed to load train data. Please go back and try again.
                    </div>
                } @else if (trainMainBranch.isLoading()) {
                    <app-spinner />
                }
            </div>
        </div>
        @if (trafficPageStateService.newVariantModalIsOpen()) {
            <app-new-variant-modal />
        }
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
        const journeyLocations = trainWithDetails?.details?.journey?.journeylocations ?? [];
        const firstLocation = journeyLocations[0]?.locations?.[0];
        const lastLocation = journeyLocations.at(-1)?.locations?.[0];

        return {
            trainNumber: mainBranch?.business.trainNumber ?? '-',
            operationalDay: mainBranch?.business.operationalDay ?? null,
            partners: listElement?.partners ?? [],
            lastChange: mainBranch?.technical.timestamp ?? null,
            branches: listElement?.branches ?? [],
            from: firstLocation?.name ?? '-',
            to: lastLocation?.name ?? '-',
            departureTime: '2026-01-01T10:00:00', // TODO: still needs to be implemented - with the JourneyRoutes Story
            arrivalTime: '2026-01-01T11:00:00', // TODO: still needs to be implemented - with the JourneyRoutes Story
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
    departureTime: string;
    arrivalTime: string;
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
