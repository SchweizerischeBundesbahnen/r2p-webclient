import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LOCALE_STORAGE_KEY, isSupportedLocale } from '../locale/locale.config';
import { SettingsModal } from '../settings/settings-modal';
import { PARTNER_OPTIONS, SettingsService } from '../settings/settings.service';
import { LanguageModal } from '../language-modal/language-modal';
import { version as packageVersion } from '../../../package.json';

interface LocaleOption {
  code: string;
  label: string;
}

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly localeId = inject(LOCALE_ID);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);

  protected readonly version = `v${packageVersion}`;

  protected readonly locales: LocaleOption[] = [
    { code: 'en-US', label: 'English' },
    { code: 'de-CH', label: 'Deutsch' },
  ];

  protected readonly currentLocale = signal(this.localeId);
  protected readonly loggedInPartner = computed(
    () =>
      PARTNER_OPTIONS.find((option) => option.name === this.settingsService.settings().partner) ?? PARTNER_OPTIONS[0],
  );

  protected goToOverview(): void {
    void this.router.navigateByUrl('/');
  }

  protected onLocaleChange(newLocale: string): void {
    if (newLocale === this.localeId) {
      return;
    }
    if (!isSupportedLocale(newLocale)) {
      return;
    }
    globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    globalThis.location.reload();
  }

  protected openSettings(): void {
    this.dialog.open(SettingsModal, {
      disableClose: true,
      width: '500px',
      maxWidth: '92vw',
    });
  }

  protected openLanguageModal(): void {
    const dialogRef = this.dialog.open(LanguageModal, {
      width: '230px',
      data: {
        locales: this.locales,
        currentLocale: this.currentLocale(),
      },
    });

    dialogRef.afterClosed().subscribe((newLocale: string | undefined) => {
      if (!newLocale) {
        return;
      }
      this.onLocaleChange(newLocale);
    });
  }
}


