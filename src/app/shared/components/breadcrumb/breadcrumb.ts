import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    /** RouterLink target. Omit for the current page (rendered as plain, non-clickable text). */
    link?: string;
}

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .breadcrumb {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 0.875rem;
            margin-bottom: var(--spacing-lg);
        }
        .breadcrumb a {
            color: var(--teal);
            text-decoration: none;
            font-weight: 600;
        }
        .breadcrumb a:hover { color: var(--navy); text-decoration: underline; }
        .breadcrumb-sep     { color: var(--steel); }
        .breadcrumb-current { color: var(--text-muted); }
    `,
    template: `
        <nav class="breadcrumb" aria-label="Breadcrumb">
            @for (item of items(); track $index; let last = $last) {
                @if (item.link) {
                    <a [routerLink]="item.link">{{ item.label }}</a>
                } @else {
                    <span class="breadcrumb-current" aria-current="page">{{ item.label }}</span>
                }
                @if (!last) {
                    <span class="breadcrumb-sep" aria-hidden="true">›</span>
                }
            }
        </nav>
    `,
})
export class Breadcrumb {
    readonly items = input.required<BreadcrumbItem[]>();
}
