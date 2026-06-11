import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../settings/settings.service';
import { SettingsModal } from '../settings/settings-modal';
import { map, take } from 'rxjs';

/**
 * Blocks navigation when settings are incomplete and opens the settings modal.
 * After the user saves valid settings the page is reloaded (triggered by the
 * modal itself), so this guard never has to "unblock" – the reload takes care
 * of re-running the full bootstrap with correct settings.
 */
export const settingsGuard: CanActivateFn = () => {
    const settingsService = inject(SettingsService);
    const dialog = inject(MatDialog);

    if (settingsService.hasConfiguredSettings()) {
        return true;
    }

    dialog.open(SettingsModal, { disableClose: true });

    // Wait for ALL dialogs to close (the modal reloads the page on valid save,
    // so this observable completing without a reload means the user dismissed
    // without saving – keep blocking).
    return dialog.afterAllClosed.pipe(
        take(1),
        map(() => false),
    );
};


