import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LocaleService } from '../locale/locale.service';
import { SettingsModal } from '../settings/settings-modal';
import { ORGANIZATION_OPTIONS, SettingsService } from '../settings/settings.service';
import { version as packageVersion } from '../../../package.json';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);
  private readonly localeService = inject(LocaleService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      map(() => this.router.url),
    ),
  );

  protected readonly version = `v${packageVersion}`;
  protected readonly locales = this.localeService.locales;
  protected readonly currentLocale = this.localeService.currentLocale;
  protected readonly isOverviewActive = computed(() => this.currentUrl() === '/');
  protected readonly loggedInOrganization = computed(
    () =>
      ORGANIZATION_OPTIONS.find((option) => option.name === this.settingsService.settings().organization) ?? null,
  );

  ngOnInit(): void {
    if (!this.settingsService.hasConfiguredSettings()) {
      this.openSettings();
    }
  }

  protected goToOverview(): void {
    void this.router.navigateByUrl('/');
  }

  protected openSettings(): void {
    this.dialog.open(SettingsModal, {
      disableClose: true,
      width: '500px',
      maxWidth: '92vw',
    });
  }

  protected switchLanguage(localeCode: string): void {
    this.localeService.switchLocale(localeCode);
  }
}

