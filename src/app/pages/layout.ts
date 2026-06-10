import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModal } from '../core/settings/settings-modal';
import { LocaleService } from '../core/locale/locale.service';
import { ErrorToastComponent } from '../core/error/error-toast';
import { PrototypeBannerComponent } from '../shared/components/prototype-banner/prototype-banner';
import { ORGANIZATION_OPTIONS, SettingsService } from '../core/settings/settings.service';
import { PartnerBadge } from '../shared/components/partner-badge/partner-badge';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, ErrorToastComponent, PrototypeBannerComponent, PartnerBadge],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .top-nav {
            background-color: var(--primary-color);
            color: white;
            padding: 0 var(--spacing-xl);
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .top-nav-brand {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-weight: 700;
            font-size: 1.2rem;
            text-decoration: none;
            color: white;
        }
        .top-nav-brand .logo { font-size: 1.5rem; }
        .top-nav-partner {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 0.875rem;
        }
        .top-nav-partner-label { opacity: 0.75; }
        .top-nav-settings-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: rgba(255,255,255,0.85);
            font-size: 1.25rem;
            line-height: 1;
            padding: 6px 8px;
            border-radius: 6px;
            transition: background-color 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .top-nav-settings-btn:hover { background-color: rgba(255,255,255,0.15); color: white; }
        .top-nav-right {
            display: flex;
            align-items: center;
            gap: var(--spacing-xl);
        }
        .version-tag {
            background-color: rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.9);
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
            background-color: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 2px;
        }
        .lang-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.7);
            font-size: 0.75rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 4px;
            cursor: pointer;
            letter-spacing: 0.04em;
            transition: background-color 0.15s, color 0.15s;
        }
        .lang-btn:hover  { background-color: rgba(255,255,255,0.15); color: white; }
        .lang-btn.active { background-color: rgba(255,255,255,0.25); color: white; }
    `,
    template: `
        <app-prototype-banner />
        <nav class="top-nav">
            <a class="top-nav-brand" routerLink="/traffic-overview">
                <span class="logo">🚂</span>
                <span i18n="@@layout.title">R2P Web Client</span>
                <span class="version-tag">v0.0.12</span>
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
