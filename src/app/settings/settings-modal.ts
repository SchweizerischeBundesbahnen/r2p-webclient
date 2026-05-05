import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ORGANIZATION_OPTIONS, SettingsService } from './settings.service';

@Component({
    selector: 'app-settings-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule ],
    templateUrl: './settings-modal.html',
    styleUrl: './settings-modal.scss',
})
export class SettingsModal {
    private readonly dialogRef = inject(MatDialogRef<SettingsModal>);
    private readonly settingsService = inject(SettingsService);

    readonly organizations = ORGANIZATION_OPTIONS;
    readonly serverUrl = signal(this.settingsService.settings().serverUrl);
    readonly organization = signal(this.settingsService.settings().organization);
    readonly isFirstTime = computed(() => !this.settingsService.hasConfiguredSettings());
    readonly canContinue = computed(
        () => this.serverUrl().trim().length > 0 && this.organizations.some((option) => option.name === this.organization()),
    );

    constructor() {
        this.dialogRef.disableClose = true;
    }

    protected onServerUrlInput(value: string): void {
        this.serverUrl.set(value);
    }

    protected onClose(): void {
        if (!this.canContinue()) {
            return;
        }

        this.persist();
        this.dialogRef.close();
    }

    private persist(): void {
        this.settingsService.save({
            serverUrl: this.serverUrl().trim(),
            organization: this.organization(),
        });
    }
}

