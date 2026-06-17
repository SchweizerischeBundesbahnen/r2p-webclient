import { MatDialog } from '@angular/material/dialog';
import { SettingsModal } from './settings-modal';

/**
 * Opens the settings modal in response to an OIDC error, unless one is already
 * open. Shared by the route guard (return-trip failures) and
 * {@link AuthSessionService} (background silent-renew failures) so both surface
 * the same dialog with identical configuration.
 */
export function openSettingsOnOidcError(
    dialog: MatDialog,
    unreachableUrl?: string,
    oidcError?: string,
    failedRedirectUri?: string,
): void {
    if (dialog.openDialogs.length === 0) {
        dialog.open(SettingsModal, { disableClose: true, data: { unreachableUrl, oidcError, failedRedirectUri } });
    }
}
