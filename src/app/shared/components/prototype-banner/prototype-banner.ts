import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-prototype-banner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .prototype-banner {
            width: 100%;
            background-color: #f5a623;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.4rem 1rem;
            font-size: 0.875rem;
            box-sizing: border-box;
            flex-wrap: wrap;
        }

        .prototype-banner a {
            color: #000;
            font-weight: 700;
            text-decoration: underline;
        }

        .prototype-banner a:hover {
            color: #333;
        }
    `],
    template: `
        <div class="prototype-banner">
            <span style="font-style: normal;">🚧</span>
            <span i18n="@@prototypeBanner.text">
                This is a <strong>prototype</strong> and must not be used in production. —
            </span>
            <a
                href="https://github.com/SchweizerischeBundesbahnen/r2p-webclient/wiki/Limitations"
                target="_blank"
                rel="noopener noreferrer"
                i18n="@@prototypeBanner.link"
            >View Limitations</a>
        </div>
    `,
})
export class PrototypeBannerComponent {}
