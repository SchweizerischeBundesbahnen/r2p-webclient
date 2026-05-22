import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-journey-route-card',
    templateUrl: './journey-route-card.html',
    styleUrl: './journey-route-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
}

