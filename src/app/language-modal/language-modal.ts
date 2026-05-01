import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface LanguageModalData {
  locales: Array<{ code: string; label: string }>;
  currentLocale: string;
}

@Component({
  selector: 'app-language-modal',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './language-modal.html',
  styleUrl: './language-modal.scss',
})
export class LanguageModal {
  private readonly dialogRef = inject(MatDialogRef<LanguageModal, string>);
  protected readonly data = inject<LanguageModalData>(MAT_DIALOG_DATA);

  protected select(localeCode: string): void {
    this.dialogRef.close(localeCode);
  }
}

