import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrafficPageStateService, TrainWithDetails } from './traffic-page-state.service';
import { Branch, BranchState } from '../../shared/models/api.models';
import { DatePipe } from '@angular/common';
import { NewVariantModal } from './new-variant-modal';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink, DatePipe, NewVariantModal],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link">Traffic Overview</a>

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
                                <button class="btn btn-outline" onclick="openShareModal()">
                                    🔗 Share Train
                                </button>
                                <button
                                    class="btn btn-primary"
                                    (click)="trafficPageStateService.toggleNewVariantModal()"
                                >
                                    ⎇ New Variant
                                </button>
                            </div>
                        </div>

                        <div class="detail-grid" style="margin-top:1rem;">
                            <div class="detail-item">
                                <div class="detail-label">Train Number</div>
                                <div class="detail-value" id="detail-train-number">
                                    {{ trainHeaderInfo.trainNumber }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">From</div>
                                <div class="detail-value" id="detail-from">
                                    {{ trainHeaderInfo.from }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Departure</div>
                                <div class="detail-value" id="detail-dep-time">
                                    {{ trainHeaderInfo.departureTime | date: 'HH:mm' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">To</div>
                                <div class="detail-value" id="detail-to">
                                    {{ trainHeaderInfo.to }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Arrival</div>
                                <div class="detail-value" id="detail-arr-time">
                                    {{ trainHeaderInfo.arrivalTime | date: 'HH:mm' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">
                                    {{ trainHeaderInfo.operationalDay }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    Gesamtstatus
                                    <span class="tooltip-anchor" tabindex="0"
                                        >?<span class="tooltip-box"
                                            >🟢 Alle Activities sind <em>confirmed</em>.<br />🟡
                                            Mindestens eine Activity ist <em>proposed</em> oder
                                            <em>requested</em>, keine abgelehnt.<br />🔴 Mindestens
                                            eine Activity ist <em>refused</em> oder
                                            <em>dropped</em>.</span
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
                                <div class="detail-label">Partners</div>
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
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">🗺️ Journey Route (main variant)</span>
                    </div>
                    <div class="card-body" style="padding-top:0.5rem; padding-bottom:0.5rem;">
                        <div class="journey-table-wrapper">
                            <table class="journey-table" id="journey-table">
                                <thead>
                                    <tr>
                                        <th style="width:200px;">Stop</th>
                                        <th>Rolling Stock</th>
                                        <th>Staff</th>
                                        <th>Path</th>
                                    </tr>
                                </thead>
                                <tbody id="journey-tbody">
                                    <!-- Rendered by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Variants Section -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">⎇ Variants</span>
                    </div>
                    <div id="branches-list">
                        @for (
                            branch of getVariantInfo(trainMainBranch.value());
                            track branch.branchName
                        ) {
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
                                            [routerLink]="'/edit-train'"
                                            class="btn btn-primary btn-sm"
                                            >✏ Edit</a
                                        ><a
                                            [routerLink]="'/read-train'"
                                            class="btn btn-ghost btn-sm"
                                            >👁 View</a
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
    providers: [TrafficPageStateService],
})
export class TrafficPage {
    readonly trainId = input.required<string>();
    protected readonly trafficPageStateService = inject(TrafficPageStateService);

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
    comment: string;
    branchName: string;
    partners: string[];
    lastChange: string;
    status: BranchState;
}
