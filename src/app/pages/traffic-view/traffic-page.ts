import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-traffic-page',
    imports: [RouterLink],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'../traffic-overview'" class="back-link">Traffic Overview</a>

                <!-- Train Header Card -->
                <div class="card" id="train-header-card">
                    <div class="card-body">
                        <div
                            style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;"
                        >
                            <div>
                                <h1 class="page-title" id="train-title">IC 1234</h1>
                                <p class="page-subtitle" id="train-name">IC 1234 Zürich–Basel</p>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-outline" onclick="openShareModal()">
                                    🔗 Share Train
                                </button>
                                <button class="btn btn-primary" onclick="openCreateBranchModal()">
                                    ⎇ New Variant
                                </button>
                            </div>
                        </div>

                        <div class="detail-grid" style="margin-top:1rem;">
                            <div class="detail-item">
                                <div class="detail-label">Train Number</div>
                                <div class="detail-value" id="detail-train-number">IC 1234</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">From</div>
                                <div class="detail-value" id="detail-from">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Departure</div>
                                <div class="detail-value" id="detail-dep-time">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">To</div>
                                <div class="detail-value" id="detail-to">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Arrival</div>
                                <div class="detail-value" id="detail-arr-time">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">2025-06-15</div>
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
                                <div class="detail-value" id="detail-status">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Partners</div>
                                <div class="detail-value" id="detail-partners">–</div>
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
                        <div class="branch-row">
                            <div class="branch-info">
                                <div>
                                    <div class="branch-name">🌿 main</div>
                                    <div class="branch-meta">
                                        <span class="partner-badge partner-badge-SBB">SBB</span>
                                        <span style="margin-left:4px;">14.04.2025, 09:00</span>
                                        — <em>Initial creation</em>
                                    </div>
                                </div>
                            </div>
                            <div
                                style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;"
                            >
                                <span class="badge badge-open">● Open</span>
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
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficPage {}
