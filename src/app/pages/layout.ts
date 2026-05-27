import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModal } from '../settings/settings-modal';
import { LocaleService } from '../locale/locale.service';
import { ErrorToastComponent } from '../shared/error/error-toast';
import { PrototypeBannerComponent } from '../shared/components/prototype-banner/prototype-banner';
import { ORGANIZATION_OPTIONS, SettingsService } from '../settings/settings.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, ErrorToastComponent, PrototypeBannerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-prototype-banner />
        <nav class="top-nav">
            <a class="top-nav-brand" routerLink="/traffic-overview">
                <span class="logo">🚂</span>
                <span i18n="@@layout.title">R2P Web Client</span>
                <span class="version-tag" style="margin-left:0.5rem;">v0.0.12</span>
            </a>
            <div class="top-nav-right">
                <div class="top-nav-partner">
                    <span class="top-nav-partner-label" i18n="@@layout.organization">Organization:</span>
                    @if (currentOrg()) {
                        <span [class]="'partner-badge partner-badge-' + currentOrg()!.name" id="nav-partner">
                            {{ currentOrg()!.name }}
                        </span>
                    } @else {
                        <span class="partner-badge" id="nav-partner">–</span>
                    }
                </div>
                <div class="lang-switcher">
                    <button class="lang-btn" [class.active]="localeService.currentLocale() === 'en-US'" (click)="setLocale('en-US')">EN</button>
                    <button class="lang-btn" [class.active]="localeService.currentLocale() === 'de-CH'" (click)="setLocale('de-CH')">DE</button>
                </div>
                <button class="top-nav-settings-btn" (click)="openSettingsModal()" i18n-title="@@layout.settings.title" title="Settings">
                    ⚙️
                </button>
            </div>
        </nav>
        <router-outlet />
        <app-error-toast />
    `,
})
export class Layout {
    private readonly dialog = inject(MatDialog);
    private readonly settingsService = inject(SettingsService);
    protected readonly localeService = inject(LocaleService);

    protected readonly currentOrg = computed(() => {
        const name = this.settingsService.settings().organization;
        return ORGANIZATION_OPTIONS.find((o) => o.name === name) ?? null;
    });

    openSettingsModal(): void {
        this.dialog.open(SettingsModal);
    }

    setLocale(locale: string): void {
        this.localeService.switchLocale(locale);
    }
}
