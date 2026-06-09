import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BackendApiService } from '../../core/api/backend-api.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { Train, TrainListElement } from '../../shared/models/api.models';

@Injectable()
export class TrafficPageState {
    readonly apiService = inject(BackendApiService);
    trainId = signal<string | undefined>(undefined);


    readonly trainMainBranch = rxResource({
        params: () => {
            const trainId = this.trainId();
            return trainId ? { trainId } : undefined;
        },
        stream: ({ params: { trainId } }): Observable<TrainWithDetails> =>
            this.apiService.getTrainById(trainId).pipe(
                switchMap((listElement) => {
                    const version = listElement.branches?.find((b) => b.technical.mainBranch)
                        ?.technical.version;
                    if (!version) {
                        return of({ listElement, details: null } satisfies TrainWithDetails);
                    }
                    return this.apiService
                        .getTrainByVersion(version)
                        .pipe(
                            map((details) => ({ listElement, details }) satisfies TrainWithDetails),
                        );
                }),
            ),
    });

}

export interface TrainWithDetails {
    listElement: TrainListElement;
    details: Train | null;
}
