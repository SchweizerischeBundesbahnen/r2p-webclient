import { inject, Injectable } from '@angular/core';
import { BackendApiService } from '../../core/api/backend-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { TrainRow } from './table-row';
import { Train } from '../../shared/models/api.models';
import {
    getEarliestJourneyLocationDeparture,
    getFirstJourneyLocationName,
    getLastJourneyLocationName,
    getLatestJourneyLocationArrival,
} from '../../shared/utils/journeyLocation.utils';
import { parseDurationToDate } from '../../shared/utils/date.utils';

@Injectable()
export class TrafficOverviewPageState {
    private readonly apiService = inject(BackendApiService);

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
                                          const operationalDay = mainBranch.business.operationalDay;
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
        start: getFirstJourneyLocationName(train),
        startTime: parseDurationToDate(operationalDay, getEarliestJourneyLocationDeparture(train)),
        end: getLastJourneyLocationName(train),
        endTime: parseDurationToDate(operationalDay, getLatestJourneyLocationArrival(train)),
        partners,
        trainNumber,
        revInfo: {
            lastChange: mainTimestamp,
            version,
        },
        trainData: train,
    };
};

export interface TrainInfos {
    train: Train;
    /** Optional in OpenAPI (TrainListElement.partners not required) */
    partners: string[] | undefined;
    mainTimestamp: string;
    version: string;
    trainNumber: string;
    operationalDay: string;
}
