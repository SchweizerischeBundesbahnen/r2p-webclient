import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ORGANIZATION_OPTIONS, Settings, SettingsService } from './settings.service';

const AZURE_V1_RE = /^https:\/\/login\.microsoftonline\.com\/[^/]+\/?$/;

export interface SettingsModalData {
    unreachableUrl?: string;
    oidcError?: string;
    failedRedirectUri?: string;
}

@Component({
    selector: 'app-settings-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatFormField, MatInput, MatSelect, MatOption, MatButton, MatIconButton, MatIcon],
    templateUrl: './settings-modal.html',
    styleUrl: './settings-modal.scss',
})
export class SettingsModal {
    private readonly dialogRef = inject(MatDialogRef<SettingsModal>);
    private readonly settingsService = inject(SettingsService);
    private readonly oidcSecurityService = inject(OidcSecurityService);
    private readonly dialogData = inject<SettingsModalData>(MAT_DIALOG_DATA, { optional: true });

    readonly unreachableUrl = this.dialogData?.unreachableUrl ?? null;
    readonly oidcError = this.dialogData?.oidcError ?? null;
    readonly failedRedirectUri = this.dialogData?.failedRedirectUri ?? null;

    readonly organizations = ORGANIZATION_OPTIONS;

    readonly serverUrl = signal(this.settingsService.settings().serverUrl);
    readonly organization = signal(this.settingsService.settings().organization);
    readonly authority = signal(this.settingsService.settings().authority);
    readonly clientId = signal(this.settingsService.settings().clientId);
    readonly scope = signal(this.settingsService.settings().scope);

    readonly isFirstTime = computed(() => !this.settingsService.hasConfiguredSettings());
    readonly submitted = signal(false);

    readonly isAuthorityValid = computed(() => {
        const val = this.authority().trim();
        if (!val) return false;
        try { new URL(val); return true; } catch { return false; }
    });

    readonly isAzureV1Authority = computed(() => AZURE_V1_RE.test(this.authority().trim()));

    readonly isServerUrlValid = computed(() => {
        const val = this.serverUrl().trim();
        if (!val) return false;
        try { new URL(val); return true; } catch { return false; }
    });

    readonly canContinue = computed(
        () =>
            this.isServerUrlValid() &&
            this.organizations.some((option) => option.name === this.organization()) &&
            this.isAuthorityValid() &&
            !this.isAzureV1Authority() &&
            this.clientId().trim().length > 0 &&
            this.scope().trim().length > 0,
    );

    constructor() {
        this.dialogRef.disableClose = !this.settingsService.hasConfiguredSettings();
    }

    protected onClose(): void {
        this.submitted.set(true);
        if (!this.canContinue()) return;
        this.persist();
        this.oidcSecurityService.logoffLocal();
        // Clear the OIDC library's sessionStorage entry so a changed authority
        // or clientId does not cause an issuer-mismatch on the next bootstrap.
        sessionStorage.removeItem('r2p-webclient');
        this.dialogRef.close();
        window.location.reload();
    }

    private persist(): void {
        const settings: Settings = {
            serverUrl: this.serverUrl().trim(),
            organization: this.organization(),
            authority: this.authority().trim(),
            clientId: this.clientId().trim(),
            scope: this.scope().trim(),
        };
        this.settingsService.save(settings);
    }
}
