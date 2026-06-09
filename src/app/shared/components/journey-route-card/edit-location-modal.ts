import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { Location, LOCATION_TYPES, LocationType } from '../../models/api.models';

@Component({
    selector: 'app-edit-location-modal',
    templateUrl: './edit-location-modal.html',
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

