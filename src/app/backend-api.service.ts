import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch, Train, TrainListElement } from './shared/models/api.models';
import { assertIsoDate } from './shared/utils/date.utils';
import { SettingsService } from './settings/settings.service';

@Injectable({ providedIn: 'root' })
export class BackendApiService {
    private readonly httpClient = inject(HttpClient);
    private readonly settingsService = inject(SettingsService);

    private get baseUrl(): string {
        return this.settingsService.settings().serverUrl;
    }

    private get tokenHeaders(): HttpHeaders {
        const org = this.settingsService.settings().organization;
        return new HttpHeaders().set('Token', org);
    }

    public listTrains(): Observable<TrainListElement[]> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<TrainListElement[]>(`${this.baseUrl}/v1/trains`, {
            headers,
        });
    }

    public createTrain(
        name: string,
        operationalDay: string,
        comment: string,
    ): Observable<TrainListElement> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains`,
            { ...minimalTrain, id: crypto.randomUUID(), name, startdate: operationalDay },
            {
                params: { comment },
                headers,
            },
        );
    }

    createBranch(trainId: string, branchName: string, comment: string): Observable<Branch> {
        const headers = this.tokenHeaders;
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches`,
            { ...minimalTrain, id: crypto.randomUUID() },
            {
                params: { branchName, comment },
                headers,
            },
        );
    }

    getTrainById(trainId: string) {
        const headers = this.tokenHeaders;
        return this.httpClient.get<TrainListElement>(`${this.baseUrl}/v1/trains/${trainId}`, {
            headers,
        });
    }

    getTrainByVersion(version: string): Observable<Train> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<Train>(`${this.baseUrl}/v1/trains/versions/${version}`, {
            headers,
        });
    }

    getByTrainIdAndBranchId(trainId: string, branchId: string): Observable<Branch> {
        const headers = this.tokenHeaders;
        return this.httpClient.get<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            {
                params: { trainId, branchId },
                headers,
            },
        );
    }

    shareTrain(trainId: string, shareWith: string, comment: string): Observable<TrainListElement> {
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains/${trainId}/share`,
            null,
            { params: { shareWith, comment }, headers: this.tokenHeaders },
        );
    }

    requestMerge(trainId: string, branchId: string, comment: string): Observable<Branch> {
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/requestMerge`,
            null,
            { params: { comment }, headers: this.tokenHeaders },
        );
    }

    merge(trainId: string, branchId: string, reviewedVersion: string, comment: string): Observable<TrainListElement> {
        return this.httpClient.post<TrainListElement>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/merge`,
            null,
            { params: { reviewedVersion, comment }, headers: this.tokenHeaders },
        );
    }

    rejectMerge(trainId: string, branchId: string, comment: string): Observable<Branch> {
        return this.httpClient.post<Branch>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}/rejectMerge`,
            null,
            { params: { comment }, headers: this.tokenHeaders },
        );
    }

    updateTrain(
        trainId: string,
        train: Train,
        branchId: string,
        name: string,
        comment: string,
        operationalDay: string,
    ): Observable<Train> {
        assertIsoDate(operationalDay);
        const headers = this.tokenHeaders;
        return this.httpClient.put<Train>(
            `${this.baseUrl}/v1/trains/${trainId}/branches/${branchId}`,
            { ...train, name, startdate: operationalDay },
            {
                params: { comment },
                headers,
            },
        );
    }
}

export const minimalTrain: Train = {
    id: '72',
    references: [
        {
            type: 'tttReferenceTrain',
            name: 'TR2185990010000000000021',
        },
    ],
    links: [],
    name: 'Zug 11062 Buchs Dällikon – Brugg AG',
    startdate: '2026-04-16',
    timestamp: '2026-03-12T12:00:00+01:00',
    journey: {
        featuresets: [],
        journeylocations: [
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-3527',
                        name: 'Buchs Dällikon',
                    },
                ],
                activities: [
                    {
                        id: 'a1-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: 'earliestdeparture',
                                duration: 'PT8H30M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        relations: [],
                    },
                ],
            },
            {
                locations: [
                    {
                        type: 'PLC',
                        code: 'CH-309',
                        name: 'Brugg AG',
                    },
                ],
                activities: [
                    {
                        id: 'a2-01',
                        type: 'path.halt.11',
                        timings: [
                            {
                                type: 'arrival',
                                duration: 'PT4H2M',
                                focus: 'planning',
                            },
                        ],
                        responsibility: {
                            type: 'rim',
                            id: '0085',
                            status: 'confirmed',
                        },
                        relations: [],
                    },
                ],
            },
        ],
    },
};
