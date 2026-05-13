import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-read-train-page',
    imports: [RouterLink],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-view'" class="back-link" id="back-link">Traffic View</a>

                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1 class="page-title" id="page-title">Read View</h1>
                        <p class="page-subtitle" id="page-subtitle">Variant: –</p>
                    </div>
                    <div class="btn-group">
                        <!-- Edit button: only for own variants -->
                        <a
                            [routerLink]="'/traffic-view'"
                            class="btn btn-primary"
                            id="edit-btn"
                            style="display:none;"
                            >✏ Edit Variant</a
                        >
                        <button class="btn btn-outline" onclick="openJsonModal()">
                            &#123; &#125; View JSON
                        </button>
                    </div>
                </div>

                <!-- Read-only notice -->
                <div class="alert alert-info">
                    👁️ This is a <strong>read-only view</strong> of the variant. No changes can be
                    made here.
                </div>

                <!-- ── Train Details Card ────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">📋 Train Details</span>
                    </div>
                    <div class="card-body">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Train Number</div>
                                <div class="detail-value" id="detail-train-number">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value" id="detail-name">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Branch Owner</div>
                                <div class="detail-value" id="detail-owner">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Variant State</div>
                                <div class="detail-value" id="detail-state">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Version</div>
                                <div class="detail-value" id="detail-version">–</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Version Timestamp</div>
                                <div class="detail-value" id="detail-timestamp">–</div>
                            </div>
                        </div>

                        <!-- Version comment -->
                        <div
                            style="margin-top: 0.5rem; background-color: var(--background-color); padding: 0.75rem 1rem; border-radius: 6px; border-left: 3px solid var(--accent-color);"
                        >
                            <div class="detail-label">Version Comment</div>
                            <div
                                style="font-size:0.875rem; color:var(--text-secondary); margin-top:0.25rem;"
                                id="detail-comment"
                            >
                                –
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Journey Card (read-only vertical table) ───────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">🗺️ Journey Route</span>
                    </div>
                    <div class="card-body" style="padding:0;">
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

                <!-- Back button -->
                <div class="btn-group" style="margin-bottom:2rem;">
                    <a [routerLink]="'/traffic-view'" class="btn btn-ghost" id="back-btn"
                        >← Back to Traffic View</a
                    >
                </div>
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadTrainPage {}
