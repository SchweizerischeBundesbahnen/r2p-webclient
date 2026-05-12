import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubtitleNavigation } from './subtitle-navigation';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-create-train-body',
    template: `
        <div class="sticky-edit-bar" id="sticky-edit-bar">
            <div class="sticky-edit-bar-inner">
                <div class="sticky-edit-bar-title">
                    <span id="sticky-title">Create New Train</span>
                    <span class="unsaved-indicator hidden" id="unsaved-indicator"
                        >● Unsaved changes</span
                    >
                </div>
                <div class="sticky-edit-bar-actions">
                    <a [routerLink]="'/overview'" class="btn btn-ghost" id="sticky-cancel-btn"
                        >Cancel</a
                    >
                    <button class="btn btn-success btn-muted" id="sticky-save-btn">
                        💾 Save Train
                    </button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/overview'" class="back-link">Traffic Overview</a>

                <div class="page-header">
                    <div>
                        <h1 class="page-title">Create New Train</h1>
                        <p class="page-subtitle">Define the train details and journey route</p>
                    </div>
                </div>

                <!-- ── Basic Info Card ──────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">📋 Train Details</span>
                    </div>
                    <div class="card-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required" for="train-name">Name</label>
                                <input
                                    type="text"
                                    id="train-name"
                                    class="form-input"
                                    placeholder="e.g., IC 1234 Zürich–Basel"
                                    value=""
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="train-opday"
                                    >Operational Day</label
                                >
                                <input
                                    type="date"
                                    id="train-opday"
                                    class="form-input"
                                    value="2025-06-15"
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label required" for="save-comment"
                                >Creation Comment</label
                            >
                            <textarea
                                id="save-comment"
                                class="form-textarea"
                                placeholder="Describe this train (required for saving)…"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- ── Journey Card ─────────────────────────────────────── -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">🗺️ Journey Route</span>
                    </div>
                </div>

                <!-- ── Action Buttons (removed – use sticky bar above) ──────── -->
            </div>
        </div>
    `,
    styles: `
        :host {
            display: block;
            //position: sticky;
            //top: 64px;
            //z-index: 99;
            //background-color: #ffffff;
            //border-bottom: 1px solid #e2e8f0;
            //box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            //margin: -2rem -2rem 2rem -2rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubtitleNavigation, RouterLink],
})
export class Body {}
