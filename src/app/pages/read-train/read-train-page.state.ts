import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Branch } from '../../shared/models/api.models';
import { BackendApiService } from '../../backend-api.service';

@Injectable()
export class ReadTrainPageState {
    private apiService = inject(BackendApiService);
    trainId = signal<string | undefined>(undefined);

    branchId = signal<string | undefined>(undefined);
    isJsonModalOpen = false;

    readonly train = rxResource({
        params: () => {
            const trainId = this.trainId();
            const branchId = this.branchId();
            return trainId && branchId ? { trainId, branchId } : undefined;
        },
        stream: ({ params: { trainId, branchId } }): Observable<Branch> =>
            this.apiService.getByTrainIdAndBranchId(trainId, branchId),
    });

    toggleIsJsonModalOpen() {
        this.isJsonModalOpen = !this.isJsonModalOpen;
    }
}
