import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-journey-route-card',
    template: `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🗺️ Journey Route</span>
            </div>
            <div class="card-body" style="padding-top:0.5rem; padding-bottom:0.5rem;">
                <div class="journey-table-wrapper">
                    <table class="journey-table" id="journey-table">
                        <thead>
                            <tr>
                                <th style="width:200px;">Stop</th>
                                <th>Rolling Stock</th>
                                <th>Staff</th>
                                <th>Path</th>
                                @if (!readonly()) {
                                    <th>Actions</th>
                                }
                            </tr>
                        </thead>
                        <tbody id="journey-tbody">
                            <!-- Rendered by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
}

