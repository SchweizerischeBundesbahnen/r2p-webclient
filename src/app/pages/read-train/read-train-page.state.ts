import { Injectable } from '@angular/core';

// TODO: umbenennen zu ReadTrainPageState -> auch bei anderen
@Injectable()
export class ReadTrainPageState {
    isJsonModalOpen = false;
    toggleIsJsonModalOpen() {
        this.isJsonModalOpen = !this.isJsonModalOpen;
    }
}
