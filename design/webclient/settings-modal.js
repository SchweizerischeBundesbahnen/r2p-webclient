/**
 * R2P Web Client – Settings Modal
 * Renders and manages the settings modal overlay used on all pages
 * after the initial setup (settings.html).
 */

(function () {
    // Inject modal HTML into the page
    const modalHtml = `
<div class="settings-modal-backdrop" id="settings-modal-backdrop" aria-modal="true" role="dialog" aria-labelledby="settings-modal-title">
    <div class="settings-modal" id="settings-modal">
        <div class="settings-modal-header">
            <span class="settings-modal-title" id="settings-modal-title">Settings</span>
            <button class="settings-modal-close" onclick="closeSettingsModal()" aria-label="Close settings">&#x2715;</button>
        </div>
        <div class="settings-modal-body">
            <form id="settings-modal-form" onsubmit="saveSettingsModal(event)">
                <div class="form-group">
                    <label class="form-label required" for="modal-server-url">Server URL</label>
                    <input
                        type="url"
                        id="modal-server-url"
                        class="form-input"
                        placeholder="https://r2p.example.com"
                        required
                    >
                    <p class="form-hint">Base URL of the R2P backend server (without trailing slash).</p>
                </div>

                <div class="form-group">
                    <label class="form-label required" for="modal-partner-select">Your Organization</label>
                    <select id="modal-partner-select" class="form-select" required>
                        <option value="" disabled>Select an organization…</option>
                        <option value="SBB">SBB – Schweizerische Bundesbahnen</option>
                        <option value="BLS">BLS – BLS AG</option>
                        <option value="SOB">SOB – Schweizerische Südostbahn</option>
                    </select>
                    <p class="form-hint">All requests will be sent on behalf of this organization.</p>
                </div>

                <div class="form-group">
                    <label class="form-label" for="modal-language-select">Language</label>
                    <div class="lang-switcher-settings" id="modal-language-select" role="group" aria-label="Language selection">
                        <button type="button" class="lang-option-btn active" data-lang="en" onclick="selectModalLang('en', this)">
                            English
                        </button>
                        <button type="button" class="lang-option-btn" data-lang="de" onclick="selectModalLang('de', this)">
                            Deutsch
                        </button>
                    </div>
                    <p class="form-hint">Display language for the web client interface.</p>
                </div>

                <div style="display:flex; gap:0.75rem; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--border-color);">
                    <button type="submit" class="btn btn-primary" style="flex:1; justify-content:center;">Save</button>
                    <button type="button" class="btn btn-ghost" onclick="closeSettingsModal()" style="flex:1; justify-content:center;">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

    document.addEventListener('DOMContentLoaded', function () {
        // Inject modal into body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Close on backdrop click
        document.getElementById('settings-modal-backdrop').addEventListener('click', function (e) {
            if (e.target === this) closeSettingsModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSettingsModal();
        });
    });

    window.openSettingsModal = function () {
        const settings = JSON.parse(localStorage.getItem('r2p_settings') || '{}');
        document.getElementById('modal-server-url').value = settings.serverUrl || '';
        document.getElementById('modal-partner-select').value = settings.partner || '';
        const lang = settings.language || 'en';
        document.querySelectorAll('#modal-language-select .lang-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        const backdrop = document.getElementById('settings-modal-backdrop');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeSettingsModal = function () {
        const backdrop = document.getElementById('settings-modal-backdrop');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    window.selectModalLang = function (lang, clickedBtn) {
        const group = clickedBtn.closest('.lang-switcher-settings');
        group.querySelectorAll('.lang-option-btn').forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
    };

    window.saveSettingsModal = function (event) {
        event.preventDefault();
        const serverUrl = document.getElementById('modal-server-url').value.trim().replace(/\/$/, '');
        const partner = document.getElementById('modal-partner-select').value;
        const language = document.querySelector('#modal-language-select .lang-option-btn.active')?.dataset.lang || 'en';
        const settings = { serverUrl, partner, language };
        localStorage.setItem('r2p_settings', JSON.stringify(settings));

        // Update nav partner badge if present
        const navPartner = document.getElementById('nav-partner');
        if (navPartner) {
            navPartner.textContent = partner;
            navPartner.className = 'partner-badge ' + (
                ['SBB', 'BLS', 'SOB'].includes(partner) ? `partner-badge-${partner}` : 'partner-badge-default'
            );
        }

        // Sync toolbar lang switcher if present
        document.querySelectorAll('.lang-btn').forEach(b => {
            const onclick = b.getAttribute('onclick') || '';
            b.classList.toggle('active', onclick.includes(`'${language}'`));
        });

        closeSettingsModal();

        // Show toast if available
        if (typeof showToast === 'function') {
            showToast('Settings saved.', 'success');
        }
    };
})();


