import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Branch } from '../../shared/models/api.models';
import { BackendApiService } from '../../backend-api.service';
import { ReadTrainPageState } from './read-train-page.state';
import { ViewJsonModal } from './view-json-modal';

@Component({
    selector: 'app-read-train-page',
    imports: [RouterLink, ViewJsonModal],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-view/' + trainId()" class="back-link" id="back-link"
                >Traffic View</a
                >

                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1 class="page-title" id="page-title">Read View</h1>
                        <p class="page-subtitle" id="page-subtitle">
                            Variant: {{ train.value()?.branchName }}
                        </p>
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
                        <button class="btn btn-outline" (click)="state.toggleIsJsonModalOpen()">
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
                        @let branch = train.value();
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Train Number</div>
                                <div class="detail-value" id="detail-train-number">
                                    {{ branch?.business?.trainNumber ?? '–' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value" id="detail-name">
                                    {{ branch?.branchName ?? '–' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">
                                    {{ branch?.business?.operationalDay ?? '–' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Branch Owner</div>
                                <div class="detail-value" id="detail-owner">
                                    <span
                                        class="partner-badge partner-badge-{{
                                            branch?.technical?.owner ?? '-'
                                        }}"
                                    >{{ branch?.technical?.owner }}</span
                                    >
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Variant State</div>
                                <div class="detail-value" id="detail-state">
                                    <span
                                        class="badge badge-{{
                                            branch?.technical?.branchState ?? ''
                                        }}"
                                    >{{ branch?.technical?.branchState ?? '–' }}</span
                                    >
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Version</div>
                                <div class="detail-value" id="detail-version">
                                    {{ branch?.technical?.version ?? '–' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Version Timestamp</div>
                                <div class="detail-value" id="detail-timestamp">
                                    {{ branch?.technical?.timestamp ?? '–' }}
                                </div>
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
                                {{ branch?.technical?.comment ?? '–' }}
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
                    <a
                        [routerLink]="'/traffic-view/' + trainId()"
                        class="btn btn-ghost"
                        id="back-btn"
                    >← Back to Traffic View</a
                    >
                </div>
            </div>
        </div>
        @if (state.isJsonModalOpen) {
            <app-read-view-json-modal [train]="train.value()!" />
        }
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ReadTrainPageState],
})
export class ReadTrainPage {
    protected state = inject(ReadTrainPageState);
    apiService = inject(BackendApiService);
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();

    // TODO: in state verschieben
    readonly train = rxResource({
        params: () => {
            const trainId = this.trainId();
            const branchId = this.branchId();
            return trainId && branchId ? { trainId, branchId } : undefined;
        },
        stream: ({ params: { trainId, branchId } }): Observable<Branch> =>
            this.apiService.getByTrainIdAndBranchId(trainId, branchId),
    });
}
