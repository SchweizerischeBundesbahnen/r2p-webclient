import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { Location, LOCATION_TYPES, LocationType } from '../../models/api.models';

@Component({
    selector: 'app-edit-location-modal',
    template: `
        <div class="modal-overlay" id="edit-location-modal">
            <div class="modal-card">
                <div class="modal-header">
                    <span class="modal-title" i18n="@@editLocationModal.title">Edit Location</span>
                    <button class="modal-close" (click)="cancelled.emit()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label" for="loc-type" i18n="@@editLocationModal.field.type">Type</label>
                        <select
                            id="loc-type"
                            class="form-select"
                            (change)="onTypeChange($event)"
                        >
                            <option value="" [selected]="editedType() === ''">—</option>
                            @for (t of locationTypes; track t) {
                                <option [value]="t" [selected]="editedType() === t">{{ t }}</option>
                            }
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loc-code" i18n="@@editLocationModal.field.code">Code</label>
                        <input
                            id="loc-code"
                            type="text"
                            class="form-input"
                            [value]="editedCode()"
                            (input)="onCodeInput($event)"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loc-name" i18n="@@editLocationModal.field.name">Name</label>
                        <input
                            id="loc-name"
                            type="text"
                            class="form-input"
                            [value]="editedName()"
                            (input)="onNameInput($event)"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost" (click)="cancelled.emit()" i18n="@@editLocationModal.cancel">
                        Cancel
                    </button>
                    <button class="btn btn-primary" (click)="onSave()" i18n="@@editLocationModal.save">
                        Save
                    </button>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLocationModal {
    readonly location = input.required<Location>();
    readonly locationSaved = output<Location>();
    readonly cancelled = output<void>();

    protected readonly locationTypes: LocationType[] = LOCATION_TYPES;

    protected readonly editedType = linkedSignal(() => this.location().type ?? '');
    protected readonly editedCode = linkedSignal(() => this.location().code ?? '');
    protected readonly editedName = linkedSignal(() => this.location().name ?? '');

    protected onTypeChange(event: Event): void {
        this.editedType.set((event.target as HTMLSelectElement).value);
    }

    protected onCodeInput(event: Event): void {
        this.editedCode.set((event.target as HTMLInputElement).value);
    }

    protected onNameInput(event: Event): void {
        this.editedName.set((event.target as HTMLInputElement).value);
    }

    protected onSave(): void {
        const type = this.editedType();
        const code = this.editedCode();
        const name = this.editedName();
        this.locationSaved.emit({
            ...this.location(),
            type: type || undefined,
            code: code || undefined,
            name: name || undefined,
        });
    }
}

