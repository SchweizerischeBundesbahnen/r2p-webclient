import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrafficPageState, TrainWithDetails } from './traffic-page.state';
import { Branch, BranchState } from '../../shared/models/api.models';
import { DatePipe } from '@angular/common';
import { NewVariantModal } from './new-variant-modal';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink, DatePipe, NewVariantModal, JourneyRouteCard],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link" i18n="@@traffic.breadcrumb.overview">Traffic Overview</a>

                @if (trafficPageStateService.hasLoadError()) {
                    <div class="alert alert-error" i18n="@@traffic.loadError">
                        ⚠️ Failed to load train data. Please go back and try again.
                    </div>
                }

                <!-- Train Header Card -->
                <div class="card" id="train-header-card">
                    @let trainHeaderInfo = getTrainHeaderInfo(trainMainBranch.value());
                    <div class="card-body">
                        <div
                            style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;"
                        >
                            <div>
                                <h1 class="page-title" id="train-title">
                                    {{ trainHeaderInfo.trainNumber }}
                                </h1>
                                <p class="page-subtitle" id="train-name">
                                    {{ trainHeaderInfo.operationalDay }}
                                </p>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-outline" onclick="openShareModal()" i18n="@@traffic.shareTrain">
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
                                    {{ trainHeaderInfo.departureTime | date: 'HH:mm' }}
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
                                    {{ trainHeaderInfo.arrivalTime | date: 'HH:mm' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@traffic.field.opDay">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">
                                    {{ trainHeaderInfo.operationalDay }}
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
                        @for (branch of getVariantInfo(trainMainBranch.value());
                            track branch.branchName) {
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
                                                    branch.lastChange | date: 'dd.MM.yyyy, HH:mm'
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
                                    <span class="badge badge-{{ branch.status }}"
                                    >● {{ branch.status }}</span
                                    >
                                    <div class="branch-actions">
                                        <a
                                            routerLink="/edit-train"
                                            [queryParams]="{
                                                trainId: trainId(),
                                                branchId: branch.branchId,
                                            }"
                                            class="btn btn-primary btn-sm"
                                            i18n="@@traffic.edit">✏ Edit</a
                                        ><a
                                        [routerLink]="'/read-train'"
                                        [queryParams]="{
                                                trainId: trainId(),
                                                branchId: branch.branchId,
                                            }"
                                        class="btn btn-ghost btn-sm"
                                        i18n="@@traffic.view">👁 View</a
                                        >
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        @if (trafficPageStateService.newVariantModalIsOpen()) {
            <app-new-variant-modal />
        }
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TrafficPageState],
})
export class TrafficPage {
    readonly trainId = input.required<string>();
    protected readonly trafficPageStateService = inject(TrafficPageState);

    private readonly trainIdEffect = effect(() => {
        this.trafficPageStateService.trainId.set(this.trainId());
    });

    protected readonly trainMainBranch = this.trafficPageStateService.trainMainBranch;

    protected getTrainHeaderInfo(
        trainWithDetails: TrainWithDetails | undefined,
    ): TrainHeaderViewModel {
        const listElement = trainWithDetails?.listElement;
        const mainBranch = listElement?.branches?.find((b) => b.technical.mainBranch);
        const journeyLocations = trainWithDetails?.details?.journey?.journeylocations ?? [];
        const firstLocation = journeyLocations[0]?.locations?.[0];
        const lastLocation = journeyLocations.at(-1)?.locations?.[0];

        return {
            trainNumber: mainBranch?.business.trainNumber ?? '–',
            operationalDay: mainBranch?.business.operationalDay ?? '–',
            partners: listElement?.partners ?? [],
            lastChange: mainBranch?.technical.timestamp ?? '–',
            branches: listElement?.branches ?? [],
            from: firstLocation?.name ?? '–',
            to: lastLocation?.name ?? '–',
            departureTime: '2026-01-01T10:00:00', // TODO:
            arrivalTime: '2026-01-01T11:00:00', // TODO:
        };
    }

    protected getVariantInfo(trainWithDetails: TrainWithDetails | undefined): VariantViewModel[] {
        return (trainWithDetails?.listElement?.branches ?? []).map((branch) => ({
            branchId: branch.branchId,
            branchName: branch.branchName,
            comment: branch.technical.comment,
            partners: branch.technical.owner ? [branch.technical.owner] : [],
            lastChange: branch.technical.timestamp,
            status: branch.technical.branchState,
        }));
    }
}

export interface TrainHeaderViewModel {
    trainNumber: string;
    operationalDay: string;
    partners: string[];
    lastChange: string;
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
}
