import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Location, LOCATION_TYPES, LocationType } from '../../models/api.models';

export interface EditStopDialogData {
    location: Location;
    isNew?: boolean;
}

@Component({
    selector: 'app-edit-stop-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle, MatDialogContent, MatDialogActions,
        MatFormField, MatLabel, MatError, MatInput, MatSelect, MatOption, MatButton, FormField,
    ],
    template: `
        @if (isNew) {
            <h2 mat-dialog-title i18n="@@editStopModal.addTitle">Add Stop</h2>
        } @else {
            <h2 mat-dialog-title i18n="@@editStopModal.title">Edit Stop</h2>
        }

        <mat-dialog-content>
            <div style="display:flex; flex-direction:column; gap:1rem; padding-top:0.5rem;">
                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.name">Stop Name (Betriebspunkt)</mat-label>
                    <input
                        matInput
                        id="stop-name"
                        [formField]="stopForm.name"
                        placeholder="e.g., Zürich HB"
                        i18n-placeholder="@@editStopModal.field.name.placeholder"
                    />
                    @if (stopForm.name().touched() && stopForm.name().invalid()) {
                        @for (error of stopForm.name().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.code">Location Code</mat-label>
                    <input
                        matInput
                        id="stop-code"
                        [formField]="stopForm.code"
                        placeholder="e.g., 8503000"
                        i18n-placeholder="@@editStopModal.field.code.placeholder"
                    />
                    @if (stopForm.code().touched() && stopForm.code().invalid()) {
                        @for (error of stopForm.code().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.type">Location Type</mat-label>
                    <mat-select id="stop-type" [formField]="stopForm.type">
                        @for (t of locationTypes; track t) {
                            <mat-option [value]="t">{{ t }}</mat-option>
                        }
                    </mat-select>
                    @if (stopForm.type().touched() && stopForm.type().invalid()) {
                        @for (error of stopForm.type().errors(); track error.kind) {
                            <mat-error>{{ error.message }}</mat-error>
                        }
                    }
                </mat-form-field>
            </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button (click)="dialogRef.close()" i18n="@@editStopModal.cancel">Cancel</button>
            <button mat-flat-button [disabled]="stopForm().submitting()" (click)="onSave()" i18n="@@editStopModal.save">Save Stop</button>
        </mat-dialog-actions>
    `,
})
export class EditStopModal {
    readonly dialogRef = inject(MatDialogRef<EditStopModal>);
    private readonly data = inject<EditStopDialogData>(MAT_DIALOG_DATA);

    protected readonly isNew = this.data.isNew ?? false;
    protected readonly locationTypes: LocationType[] = LOCATION_TYPES;

    private readonly model = signal({
        name: this.data.location.name ?? '',
        code: this.data.location.code ?? '',
        type: this.data.location.type ?? '',
    });

    protected readonly stopForm = form(this.model, (p) => {
        required(p.name, { message: $localize`:@@validation.required:Required` });
        required(p.code, { message: $localize`:@@validation.required:Required` });
        required(p.type, { message: $localize`:@@validation.required:Required` });
    });

    protected onSave(): void {
        void submit(this.stopForm, async (field) => {
            const { name, code, type } = field().value();
            this.dialogRef.close({ ...this.data.location, name, code, type } satisfies Location);
        });
    }
}
