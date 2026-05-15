import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { BackendApiService } from '../../backend-api.service';
import { CreatePageState } from './create-train-state';

@Component({
    selector: 'app-create-train-page',
    template: `
        <div class="sticky-edit-bar" [class.dirty]="createTrainForm().dirty()" id="sticky-edit-bar">
            <div class="sticky-edit-bar-inner">
                <div class="sticky-edit-bar-title">
                    <span id="sticky-title">Create New Train</span>
                    <span
                        class="unsaved-indicator"
                        [class.hidden]="!createTrainForm().dirty()"
                        id="unsaved-indicator"
                    >● Unsaved changes</span
                    >
                </div>
                <div class="sticky-edit-bar-actions">
                    <a
                        [routerLink]="'/traffic-overview'"
                        class="btn btn-ghost"
                        id="sticky-cancel-btn"
                    >Cancel</a
                    >
                    <button
                        class="btn btn-success"
                        id="sticky-save-btn"
                        [class.btn-muted]="createTrainForm().invalid()"
                        [disabled]="createTrainForm().invalid()"
                        (click)="createTrain()"
                    >
                        💾 Save Train
                    </button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="container">
                <a [routerLink]="'/traffic-overview'" class="back-link">Traffic Overview</a>

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
                                    [formField]="createTrainForm.name"
                                />
                                @if (createTrainForm.name().touched() &&
                                createTrainForm.name().invalid()) {
                                    @for (error of createTrainForm.name().errors(); track error) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="train-opday"
                                >Operational Day</label
                                >
                                <input
                                    type="date"
                                    id="train-opday"
                                    class="form-input"
                                    [formField]="createTrainForm.operationalDay"
                                />
                                @if (createTrainForm.operationalDay().touched() &&
                                createTrainForm.operationalDay().invalid()) {
                                    @for (error of createTrainForm.operationalDay().errors();
                                        track error) {
                                        <span class="form-error">{{ error.message }}</span>
                                    }
                                }
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
                                [formField]="createTrainForm.creationComment"
                            ></textarea>
                            @if (createTrainForm.creationComment().touched() &&
                            createTrainForm.creationComment().invalid()) {
                                @for (error of createTrainForm.creationComment().errors();
                                    track error) {
                                    <span class="form-error">{{ error.message }}</span>
                                }
                            }
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
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, FormField],
    providers: [CreatePageState],
})
export class CreateTrainPage {
    private apiService = inject(BackendApiService);
    private router = inject(Router);
    private state = inject(CreatePageState);
    protected createTrainForm = inject(CreatePageState).createTrainForm;

    protected createTrain() {
        if (this.state.createTrainRunning) return;
        this.state.createTrainRunning = true;
        const { name, creationComment, operationalDay } = this.state.createTrainForm().value();
        this.apiService.createTrain(name, operationalDay, creationComment, 'SBB').subscribe({
            next: () => (this.state.createTrainSuccess = true),
            error: (err) => {
                this.state.createTrainSuccess = false;
                console.warn('Error creating train:', err);
            },
            complete: () => {
                console.log('Create train request done. Success: ', this.state.createTrainSuccess);
                this.state.createTrainRunning = false;
                if (this.state.createTrainSuccess) {
                    this.router.navigate(['/traffic-overview']);
                }
            },
        });
    }
}
