import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PARTNER_OPTIONS, SettingsService } from './settings.service';

@Component({
  selector: 'app-settings-modal',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.scss',
})
export class SettingsModal {
  private readonly dialogRef = inject(MatDialogRef<SettingsModal>);
  private readonly settingsService = inject(SettingsService);

  readonly partners = PARTNER_OPTIONS;
  readonly serverUrl = signal(this.settingsService.settings().serverUrl);
  readonly partner = signal(this.settingsService.settings().partner);

  onServerUrlInput(value: string): void {
    this.serverUrl.set(value);
  }

  onClose(): void {
    this.persist();
    this.dialogRef.close();
  }

  onOverviewClick(event: Event): void {
    event.preventDefault();
    this.persist();
    this.dialogRef.close();
  }

  private persist(): void {
    this.settingsService.save({
      serverUrl: this.serverUrl().trim(),
      partner: this.partner(),
    });
  }
}


