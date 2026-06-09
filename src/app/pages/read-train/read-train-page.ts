import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
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

@Component({
    selector: 'app-read-train-page',
    imports: [RouterLink, DatePipe, JourneyRouteCard, Spinner, MatButton, MatAnchor, DetailGrid, DetailItem, PartnerBadge, AlertBanner],
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
                    <app-alert-banner type="error" i18n="@@readTrain.loadError">
                        ⚠️ Failed to load train data. Please go back and try again.
                    </app-alert-banner>
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
                            mat-raised-button
                            color="primary"
                            id="edit-btn"
                            style="display:none;"
                            i18n="@@readTrain.editVariant">✏ Edit Variant</a
                        >
                        <button mat-stroked-button (click)="openJsonModal()" i18n="@@readTrain.viewJson">View JSON</button>
                    </div>
                </div>

                <!-- Read-only notice -->
                <app-alert-banner type="info" i18n="@@readTrain.readonlyNotice">
                    👁️ This is a <strong>read-only view</strong> of the variant. No changes can be
                    made here.
                </app-alert-banner>

                <!-- ── Train Details Card ────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title" i18n="@@readTrain.section.trainDetails">📋 Train Details</span>
                    </div>
                    <div class="card-body">
                        @let branch = state.trainAndBranch.value()?.branch;
                        <app-detail-grid>
                            <app-detail-item label="Train Number" i18n-label="@@readTrain.field.trainNumber" valueId="detail-train-number">{{ branch?.business?.trainNumber ?? '-' }}</app-detail-item>
                            <app-detail-item label="Name" i18n-label="@@readTrain.field.name" valueId="detail-name">{{ branch?.branchName ?? '-' }}</app-detail-item>
                            <app-detail-item label="Operational Day" i18n-label="@@readTrain.field.opDay" valueId="detail-op-day">
                                @let opDay = branch?.business?.operationalDay;
                                {{ opDay ? (isoDateToUtc(opDay) | date: 'mediumDate' : 'UTC') : '-' }}
                            </app-detail-item>
                            <app-detail-item label="Branch Owner" i18n-label="@@readTrain.field.branchOwner" valueId="detail-owner">
                                @if (branch?.technical?.owner) {
                                    <app-partner-badge [partner]="branch!.technical.owner!" />
                                } @else { - }
                            </app-detail-item>
                            <app-detail-item label="Variant State" i18n-label="@@readTrain.field.variantState" valueId="detail-state">
                                <span [class]="'badge badge-' + (branch?.technical?.branchState ?? '')">{{ branch?.technical?.branchState ?? '-' }}</span>
                            </app-detail-item>
                            <app-detail-item label="Version" i18n-label="@@readTrain.field.version" valueId="detail-version">{{ branch?.technical?.version ?? '-' }}</app-detail-item>
                            <app-detail-item label="Version Timestamp" i18n-label="@@readTrain.field.versionTimestamp" valueId="detail-timestamp">
                                @let ts = branch?.technical?.timestamp;
                                {{ ts ? (ts | date: 'short') : '-' }}
                            </app-detail-item>
                        </app-detail-grid>

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
                <app-journey-route-card [readonly]="true" [journey]="state.trainAndBranch.value()?.train?.journey" />

                <!-- Back button -->
                <div class="btn-group" style="margin-bottom:2rem;">
                    <a
                        [routerLink]="'/traffic-view/' + trainId()"
                        mat-button
                        id="back-btn"
                        i18n="@@readTrain.backToTraffic">← Back to Traffic View</a
                    >
                </div>
                }
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadTrainPage {
    protected state = inject(ReadTrainPageState);
    readonly trainId = input.required<string>();
    readonly branchId = input.required<string>();
    protected readonly isoDateToUtc = isoDateToUtc;
    private readonly dialog = inject(MatDialog);

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
