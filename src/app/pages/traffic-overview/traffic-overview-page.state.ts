import { inject, Injectable } from '@angular/core';
import { BackendApiService } from '../../backend-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { TrainRow } from './table-row';
import { Train } from '../../shared/models/api.models';

@Injectable()
export class TrafficOverviewPageState {
    private apiService = inject(BackendApiService);

    trainListResource = rxResource({
        stream: () => {
            return this.apiService
                .listTrains()
                .pipe(
                    switchMap((trainList) =>
                        trainList.length === 0
                            ? of([])
                            : forkJoin(
                                  trainList.map(
                                      ({ branches, partners, mainTimestamp, trainId }) => {
                                          const mainBranch = branches.find(
                                              ({ technical: { mainBranch } }) => mainBranch,
                                          )!;
                                          const trainNumber = mainBranch.business.trainNumber;
                                          const operationalDay =
                                              mainBranch.business.operationalDay;
                                          const version = mainBranch.technical.version;
                                          return this.apiService.getTrainByVersion(version).pipe(
                                              map(
                                                  (train): TrainInfos => ({
                                                      train: { ...train, id: trainId },
                                                      partners,
                                                      trainNumber,
                                                      operationalDay,
                                                      mainTimestamp,
                                                      version,
                                                  }),
                                              ),
                                          );
                                      },
                                  ),
                              ),
                    ),
                )
                .pipe(map((trainList) => trainList.map((it) => mapTrainToOverviewRow(it))));
        },
    });
}

export const mapTrainToOverviewRow = ({
    train,
    partners,
    trainNumber,
    operationalDay,
    mainTimestamp,
    version,
}: TrainInfos): TrainRow => {
    return {
        id: train.id,
        operationalDay,
        start: train.journey?.journeylocations?.[0]?.locations?.[0]?.name,
        startTime: '2026-01-01T10:00:00', // TODO:
        end: train.journey?.journeylocations?.slice(-1)?.[0]?.locations?.[0]?.name,
        endTime: '2026-01-01T11:00:00', // TODO:
        partners,
        trainNumber,
        revInfo: {
            lastChange: mainTimestamp,
            version,
        },
    };
};

export interface TrainInfos {
    train: Train;
    partners: string[] | undefined;
    mainTimestamp: string | undefined;
    version: string | undefined;
    trainNumber: string | undefined;
    operationalDay: string | undefined;
}
