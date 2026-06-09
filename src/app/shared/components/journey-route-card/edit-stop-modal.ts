import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Location, LOCATION_TYPES, LocationType } from '../../models/api.models';

export interface EditStopDialogData {
    location: Location;
}

@Component({
    selector: 'app-edit-stop-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle, MatDialogContent, MatDialogActions,
        MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton,
    ],
    template: `
        <h2 mat-dialog-title i18n="@@editStopModal.title">Edit Stop</h2>

        <mat-dialog-content>
            <div style="display:flex; flex-direction:column; gap:1rem; padding-top:0.5rem;">
                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.name">Stop Name (Betriebspunkt)</mat-label>
                    <input
                        matInput
                        id="stop-name"
                        [value]="editedName()"
                        (input)="editedName.set($any($event.target).value)"
                        placeholder="e.g., Zürich HB"
                        i18n-placeholder="@@editStopModal.field.name.placeholder"
                    />
                </mat-form-field>

                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.code">Location Code</mat-label>
                    <input
                        matInput
                        id="stop-code"
                        [value]="editedCode()"
                        (input)="editedCode.set($any($event.target).value)"
                        placeholder="e.g., 8503000"
                        i18n-placeholder="@@editStopModal.field.code.placeholder"
                    />
                </mat-form-field>

                <mat-form-field appearance="outline" style="width:100%">
                    <mat-label i18n="@@editStopModal.field.type">Location Type</mat-label>
                    <mat-select
                        id="stop-type"
                        [value]="editedType()"
                        (selectionChange)="editedType.set($event.value)"
                    >
                        <mat-option value="">—</mat-option>
                        @for (t of locationTypes; track t) {
                            <mat-option [value]="t">{{ t }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>
            </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button (click)="dialogRef.close()" i18n="@@editStopModal.cancel">Cancel</button>
            <button mat-flat-button (click)="onSave()" i18n="@@editStopModal.save">✓ Save Stop</button>
        </mat-dialog-actions>
    `,
})
export class EditStopModal {
    readonly dialogRef = inject(MatDialogRef<EditStopModal>);
    private readonly data = inject<EditStopDialogData>(MAT_DIALOG_DATA);

    protected readonly locationTypes: LocationType[] = LOCATION_TYPES;

    protected readonly editedName = signal(this.data.location.name ?? '');
    protected readonly editedCode = signal(this.data.location.code ?? '');
    protected readonly editedType = signal(this.data.location.type ?? '');

    protected onSave(): void {
        this.dialogRef.close({
            ...this.data.location,
            type: this.editedType() || undefined,
            code: this.editedCode() || undefined,
            name: this.editedName() || undefined,
        } satisfies Location);
    }
}
