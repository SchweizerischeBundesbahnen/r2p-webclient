import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { version } from '../../../package.json';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SettingsModal } from '../core/settings/settings-modal';
import { LocaleService } from '../core/locale/locale.service';
import { ErrorToastComponent } from '../core/error/error-toast';
import { PrototypeBannerComponent } from '../shared/components/prototype-banner/prototype-banner';
import { ORGANIZATION_OPTIONS, SettingsService } from '../core/settings/settings.service';
import { PartnerBadge } from '../shared/components/partner-badge/partner-badge';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, MatIcon, ErrorToastComponent, PrototypeBannerComponent, PartnerBadge],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .top-nav {
            background-color: #ffffff;
            color: var(--navy);
            padding: 0 var(--spacing-xl);
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
            border-bottom: 1px solid var(--border-subtle);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        /* 2px orange brand hairline beneath the bar (Brand Guidelines §8.1) */
        .top-nav::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -2px;
            height: 2px;
            background-color: var(--orange);
        }
        .top-nav-brand {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            text-decoration: none;
            color: var(--navy);
        }
        .top-nav-logo {
            width: 34px;
            height: 34px;
            display: block;
            border-radius: 8px;
        }
        .wordmark {
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--navy);
            letter-spacing: -0.01em;
        }
        .top-nav-partner {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 0.875rem;
        }
        .top-nav-partner-label { color: var(--teal); }
        .top-nav-settings-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--teal);
            line-height: 1;
            padding: 6px 8px;
            border-radius: 6px;
            transition: background-color 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .top-nav-settings-btn mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
        }
        .top-nav-settings-btn:hover { background-color: var(--light-grey); color: var(--navy); }
        .top-nav-right {
            display: flex;
            align-items: center;
            gap: var(--spacing-xl);
        }
        .version-tag {
            background-color: var(--light-grey);
            color: var(--teal);
            border: 1px solid var(--border-subtle);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin-left: 0.5rem;
        }
        .lang-switcher {
            display: flex;
            align-items: center;
            gap: 2px;
        }
        .lang-btn {
            background: none;
            border: none;
            color: var(--teal);
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 8px;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            letter-spacing: 0.04em;
            transition: color 0.15s, border-color 0.15s;
        }
        .lang-btn:hover  { color: var(--navy); }
        .lang-btn.active { color: var(--navy); border-bottom-color: var(--orange); }
    `,
    template: `
        <app-prototype-banner />
        <nav class="top-nav">
            <a class="top-nav-brand" routerLink="/traffic-overview">
                <img class="top-nav-logo" src="r2p-mark.svg" alt="R²P" />
                <span class="wordmark" i18n="@@layout.title">ServiceManager</span>
                <span class="version-tag">v{{ appVersion }}</span>
            </a>
            <div class="top-nav-right">
                <div class="top-nav-partner">
                    <span class="top-nav-partner-label" i18n="@@layout.organization">Organization:</span>
                    <app-partner-badge [partner]="currentOrg()?.name ?? ''" id="nav-partner" />
                </div>
                <div class="lang-switcher">
                    <button class="lang-btn" [class.active]="localeService.currentLocale() === 'en-US'" (click)="setLocale('en-US')">EN</button>
                    <button class="lang-btn" [class.active]="localeService.currentLocale() === 'de-CH'" (click)="setLocale('de-CH')">DE</button>
                </div>
                <button class="top-nav-settings-btn" (click)="openSettingsModal()" i18n-title="@@layout.settings.title" title="Settings">
                    <mat-icon>settings</mat-icon>
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
    protected readonly appVersion = version;

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
