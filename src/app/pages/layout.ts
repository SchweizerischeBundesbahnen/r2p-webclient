import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <nav class="top-nav">
            <a class="top-nav-brand" href="overview.html">
                <span class="logo">🚂</span>
                R2P Web Client
                <span class="version-tag" style="margin-left:0.5rem;">v0.0.12</span>
            </a>
            <div class="top-nav-right">
                <div class="top-nav-partner">
                    <span class="top-nav-partner-label">Organization:</span>
                    <span class="partner-badge partner-badge-SBB" id="nav-partner">SBB</span>
                </div>
                <div class="lang-switcher">
                    <button class="lang-btn active" onclick="setLang('en', this)">EN</button>
                    <button class="lang-btn" onclick="setLang('de', this)">DE</button>
                </div>
                <button class="top-nav-settings-btn" onclick="openSettingsModal()" title="Settings">
                    ⚙️
                </button>
            </div>
        </nav>
        <router-outlet/>
    `,
})
export class Layout {}
