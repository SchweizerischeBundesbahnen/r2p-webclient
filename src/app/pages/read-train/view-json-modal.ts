import { Component, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Train } from '../../shared/models/api.models';
import { ReadTrainPageState } from './read-train-page.state';

@Component({
    selector: 'app-read-view-json-modal',
    imports: [JsonPipe],
    template: `
        <div class="modal-overlay" id="modal-json">
            <div class="modal-card modal-xl">
                <div class="modal-header">
                    <span class="modal-title" i18n="@@viewJsonModal.title">JSON – Train Payload</span>
                    <button class="modal-close" (click)="close()">✕</button>
                </div>
                <div class="modal-body" style="padding:1rem;">
                    <pre class="json-viewer" id="json-viewer-content">{{ train() | json }}</pre>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost" (click)="close()" i18n="@@viewJsonModal.close">Close</button>
                </div>
            </div>
        </div>
    `,
})
export class ViewJsonModal {
    state = inject(ReadTrainPageState);
    train = input.required<Train>();

    close() {
        this.state.toggleIsJsonModalOpen();
    }
}
