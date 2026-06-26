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
