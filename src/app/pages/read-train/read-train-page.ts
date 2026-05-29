import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReadTrainPageState } from './read-train-page.state';
import { ViewJsonModal } from './view-json-modal';
import { DatePipe } from '@angular/common';
import { JourneyRouteCard } from '../../shared/components/journey-route-card/journey-route-card';
import { isoDateToUtc } from '../../shared/utils/date.utils';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
    selector: 'app-read-train-page',
    imports: [RouterLink, ViewJsonModal, DatePipe, JourneyRouteCard, Spinner],
    template: `
        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-view/' + trainId()" class="back-link" id="back-link"
                    i18n="@@readTrain.breadcrumb.traffic">Traffic View</a
                >

                @if (state.trainAndBranch.isLoading()) {
                    <app-spinner />
                } @else if (state.trainAndBranch.error()) {
                    <div class="alert alert-error" i18n="@@readTrain.loadError">
                        ⚠️ Failed to load train data. Please go back and try again.
                    </div>
                } @else {

                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1 class="page-title" id="page-title" i18n="@@readTrain.breadcrumb.read">Read View</h1>
                        <p class="page-subtitle" id="page-subtitle">
                            Variant: {{ state.trainAndBranch.value()?.branch?.branchName }}
                        </p>
                    </div>
                    <div class="btn-group">
                        <!-- Edit button: only for own variants -->
                        <a
                            [routerLink]="'/traffic-view'"
                            class="btn btn-primary"
                            id="edit-btn"
                            style="display:none;"
                            i18n="@@readTrain.editVariant">✏ Edit Variant</a
                        >
                        <button class="btn btn-outline" (click)="state.toggleIsJsonModalOpen()" i18n="@@readTrain.viewJson">
                            View JSON
                        </button>
                    </div>
                </div>

                <!-- Read-only notice -->
                <div class="alert alert-info" i18n="@@readTrain.readonlyNotice">
                    👁️ This is a <strong>read-only view</strong> of the variant. No changes can be
                    made here.
                </div>

                <!-- ── Train Details Card ────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title" i18n="@@readTrain.section.trainDetails">📋 Train Details</span>
                    </div>
                    <div class="card-body">
                        @let branch = state.trainAndBranch.value()?.branch;
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.trainNumber">Train Number</div>
                                <div class="detail-value" id="detail-train-number">
                                    {{ branch?.business?.trainNumber ?? '-' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.name">Name</div>
                                <div class="detail-value" id="detail-name">
                                    {{ branch?.branchName ?? '-' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.opDay">Operational Day</div>
                                <div class="detail-value" id="detail-op-day">
                                    @let opDay = branch?.business?.operationalDay;
                                    {{ opDay ? (isoDateToUtc(opDay) | date: 'mediumDate' : 'UTC') : '-' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.branchOwner">Branch Owner</div>
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
                                <div class="detail-label" i18n="@@readTrain.field.variantState">Variant State</div>
                                <div class="detail-value" id="detail-state">
                                    <span
                                        class="badge badge-{{
                                            branch?.technical?.branchState ?? ''
                                        }}"
                                        >{{ branch?.technical?.branchState ?? '-' }}</span
                                    >
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.version">Version</div>
                                <div class="detail-value" id="detail-version">
                                    {{ branch?.technical?.version ?? '-' }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label" i18n="@@readTrain.field.versionTimestamp">Version Timestamp</div>
                                <div class="detail-value" id="detail-timestamp">
                                    @let ts = branch?.technical?.timestamp;
                                    {{ ts ? (ts | date: 'short') : '-' }}
                                </div>
                            </div>
                        </div>

                        <!-- Version comment -->
                        <div
                            style="margin-top: 0.5rem; background-color: var(--background-color); padding: 0.75rem 1rem; border-radius: 6px; border-left: 3px solid var(--accent-color);"
                        >
                            <div class="detail-label" i18n="@@readTrain.field.versionComment">Version Comment</div>
                            <div
                                style="font-size:0.875rem; color:var(--text-secondary); margin-top:0.25rem;"
                                id="detail-comment"
                            >
                                {{ branch?.technical?.comment ?? '-' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Journey Card (read-only vertical table) ───────────── -->
                <app-journey-route-card [readonly]="true" />

                <!-- Back button -->
                <div class="btn-group" style="margin-bottom:2rem;">
                    <a
                        [routerLink]="'/traffic-view/' + trainId()"
                        class="btn btn-ghost"
                        id="back-btn"
                        i18n="@@readTrain.backToTraffic">← Back to Traffic View</a
                    >
                </div>
                }
            </div>
        </div>
        @if (state.isJsonModalOpen) {
            <app-read-view-json-modal [train]="state.trainAndBranch.value()!.train" />
        }
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadTrainPage {
    protected state = inject(ReadTrainPageState);
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();
    protected readonly isoDateToUtc = isoDateToUtc;

    private readonly updateState = effect(() => {
        this.state.trainId.set(this.trainId());
        this.state.branchId.set(this.branchId());
    });
}
