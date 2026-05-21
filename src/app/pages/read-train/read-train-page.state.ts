import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap } from 'rxjs';
import { BackendApiService } from '../../backend-api.service';
import { BranchAndTrain } from '../edit-train/edit-train-page.state';

@Injectable()
export class ReadTrainPageState {
    private apiService = inject(BackendApiService);
    trainId = signal<string | undefined>(undefined);

    branchId = signal<string | undefined>(undefined);
    isJsonModalOpen = false;

    readonly hasLoadError = computed(() => this.trainAndBranch.error() != null);

    readonly trainAndBranch = rxResource({
        params: () => {
            const trainId = this.trainId();
            const branchId = this.branchId();
            return trainId && branchId ? { trainId, branchId } : undefined;
        },
        stream: ({ params: { trainId, branchId } }): Observable<BranchAndTrain> =>
            this.apiService
                .getByTrainIdAndBranchId(trainId, branchId)
                .pipe(
                    switchMap((branch) =>
                        this.apiService
                            .getTrainByVersion(branch.technical.version)
                            .pipe(map((train) => ({ train, branch }))),
                    ),
                ),
    });

    toggleIsJsonModalOpen() {
        this.isJsonModalOpen = !this.isJsonModalOpen;
    }
}
