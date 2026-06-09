import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-alert-banner',
    template: `<div [class]="'alert alert-' + type()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBanner {
    readonly type = input.required<'info' | 'error' | 'warning' | 'success'>();
}
